---
title: Rounds and manifest
description: Check a distribution round against the chain and verify its manifest byte for byte.
icon: flow
order: 67
---

# Rounds and manifest

## Verify a distribution round

```js
const round = await verifyRound(client, {
  distributor, roundId: 0n, level: "complete",
  manifestBaseUrl: "https://app.tryclaire.net", // or pass `manifest`, the exact string you saved
  snapshotClient,                               // only when the snapshot is on another chain
});
if (!round.ok) console.log(round.checks.filter((check) => !check.ok));
```

Distributor roots are cumulative, so every root lists every account with an entitlement for its asset. The levels build on each other:

| Level | What it proves |
| --- | --- |
| `manifest` (default) | The manifest's keccak-256 equals the round's on-chain `evidence`; its leaves rebuild the on-chain Merkle root and `cumulativeTotal`; its chain, distributor, asset and snapshot block match the round; `total` is the increase over the asset's previous root, `previousEvidence` names that previous root, and every account's `cumulative` equals its previous cumulative plus this round's `amount`. The previous manifest is fetched from `manifestBaseUrl` or passed as `previousManifest`. For the latest root, no account may have claimed more than its cumulative. |
| `balances` | Adds: each holder leaf's `balance` equals `balanceOf` at the snapshot block on the snapshot chain, and every amount equals `floor(distributable * balance / eligibleBalance)`. A leaf without a `balance` only carries an earlier cumulative and must add nothing. |
| `complete` | Adds: a chunked `Transfer` scan of the snapshot token up to the snapshot block. After the manifest's exclusions and minimum balance, the eligible balances must sum to `eligibleBalance`, and every holder with a non-zero share must have the right amount. |

Referral rounds carry their rewards in the manifest instead of balances, and each leaf's `amount` must equal that account's reward sum (an account carried over from earlier rounds has none). The hashing helpers are exported as well: `roundLeafHash(chainId, distributor, asset, { account, cumulative })`, `merkleRoot`, `merkleProof` and `manifestEvidence`. The readers behind the verifiers are exported too: `readLaunch`, `readRouter`, `readLock`, `readRevenueLock`, `readPriceLock`, `readVestingVault`, `readSplit`, `readRound` and `readProof`.

Verification shows that a round matches its published manifest and the chain's balances. It cannot show that the excluded addresses were the right ones to exclude; the manifest lists them so you can judge.

## The round manifest

Every distributor round, whatever its purpose (`project-holders`, `claire-holders`, `airdrop` or `referrals`), has one manifest per published root (per asset). The on-chain `evidence` is

```text
evidence = keccak256( UTF-8 bytes of the manifest JSON, exactly as served )
```

Claire stores the exact string and serves it verbatim and unauthenticated, with an immutable cache:

```text
GET https://app.tryclaire.net/rounds/<chainId>/<distributor, lowercase>/<evidence>.json
```

`<chainId>` is the distributor's chain and `<evidence>` is the round's `0x`-prefixed hash. The same URL is returned as `manifestUrl` by the [rounds endpoint](../api/token-reads.md#read-token-locks-fee-routers-and-rounds). Hash the bytes you downloaded, not a re-serialized copy: key order and whitespace matter. This is manifest version 1, the only version. Keys appear in the order below, with no whitespace:

```json
{ "kind": "claire-round", "version": 1, "purpose": "airdrop",
  "chainId": 4663, "distributor": "0x…", "asset": "0x…",
  "previousEvidence": "0x…",
  "total": "1000000", "cumulativeTotal": "3000000",
  "snapshot": { "chainId": 4663, "block": "12345678", "token": "0x…" },
  "rule": { "type": "pro-rata", "distributable": "1000000", "eligibleBalance": "5000000",
            "excluded": ["0x…"], "minBalance": null },
  "leaves": [ { "account": "0x…", "amount": "200000", "cumulative": "600000", "balance": "1000000" } ] }
```

(Shown with whitespace for reading; the served string has none.)

| Field | Meaning |
| --- | --- |
| `chainId`, `distributor`, `asset` | The chain, distributor contract and payout asset. Addresses are lowercase. |
| `previousEvidence` | The evidence of the previous root for this asset on this distributor, or `null` for the first. Following it walks the asset's whole history. |
| `total` | Raw units this round adds: the sum of the leaves' `amount`. |
| `cumulativeTotal` | Raw units promised in total after this round; equals the on-chain `cumulativeTotal` and the sum of the leaves' `cumulative`, and the previous root's `cumulativeTotal` plus `total`. |
| `snapshot` | Chain and block of the balances, and the token whose balances were read. `token` is `null` for referral rounds. |
| `rule` | `pro-rata`: `distributable` (the amount split), `eligibleBalance` (sum of every eligible balance, including holders whose share rounds to zero, so rounding dust stays in the distributor), `excluded` (sorted lowercase addresses removed before splitting) and `minBalance` (raw units or `null`; airdrops set their minimum $CLAIRE balance). `referral-rewards`: `rewards`, a list of `[account, amount, [reward IDs, sorted]]`. |
| `leaves` | Every account with a cumulative entitlement for the asset, sorted by account ascending. `amount` is what this round adds (it may be `"0"` for an account carried over), `cumulative` is the running total after this round and is what the Merkle leaf commits to, and `balance` is the holder's snapshot balance, `null` for referral rounds and carried-over accounts. |

**Continuity.** A verifier checks that `sum(amount) == total`; that for every account `cumulative` equals the previous manifest's cumulative (fetched through `previousEvidence`) plus `amount`; that `cumulativeTotal` equals the previous `cumulativeTotal` plus `total`; and that the root and `cumulativeTotal` match the on-chain round. A claim uses the latest root and pays `cumulative` minus what the account already claimed.

**Pro-rata formula**, per eligible holder with snapshot `balance`:

```text
amount = floor( distributable * balance / eligibleBalance )
```

A holder whose amount is zero adds nothing in this round. **Leaf hash** and **tree**, the same as `ClaireDistributor.leaf` and its claim-time verification:

```text
leaf = keccak256( keccak256( abi.encode(uint256 chainId, address distributor,
                 address asset, address account, uint256 cumulative) ) )
node = keccak256( abi.encode(smaller, larger) )      // sorted pair of child hashes
```

Level 0 is the leaf hashes in manifest order. Each level hashes neighbours `(2i, 2i+1)` as a sorted pair; an unpaired last node moves up unchanged. The single node at the top is the asset's `root`. Leaves bind the chain, distributor and asset, so a proof cannot be replayed elsewhere.

## Without the SDK

These checks use only an RPC endpoint and the contract functions; see [Verify without the SDK](index.md#verify-without-the-sdk) for the setup.

1. Read the round: `getRound(roundId)` returns `(asset, snapshotBlock, cumulativeTotal, root, evidence)`, and the asset's live state with `root(asset)`, `cumulativeTotal(asset)` and `totalClaimed(asset)`.
2. Download the manifest from the URL above, saved byte for byte. Check that `keccak256` of its bytes equals `evidence`. `cast keccak` hashes text as UTF-8, and the manifest starts with `{`:

   ```sh
   cast call "$DISTRIBUTOR" "getRound(uint256)((address,uint64,uint256,bytes32,bytes32))" 0 --rpc-url "$RPC_URL"
   cast keccak "$(cat manifest.json)"
   ```

3. Check the manifest's `chainId`, `distributor`, `asset`, `cumulativeTotal` and `snapshot.block` against the chain and the round, and that the leaf amounts sum to `total`. Fetch the manifest named by `previousEvidence`, and check that every account's `cumulative` equals its previous cumulative plus its `amount` and that `cumulativeTotal` equals the previous one plus `total`.
4. Compute each leaf hash and rebuild the tree as described above. The root must equal the on-chain `root`. For one leaf:

   ```sh
   cast keccak "$(cast keccak "$(cast abi-encode 'f(uint256,address,address,address,uint256)' \
     "$CHAIN_ID" "$DISTRIBUTOR" "$ASSET" "$ACCOUNT" "$CUMULATIVE")")"
   ```

   The distributor's own `leaf(asset, account, cumulative)` view returns the same value.
5. For a pro-rata round, read each leaf's balance at the snapshot block on the snapshot chain with `cast call "$TOKEN" "balanceOf(address)(uint256)" "$ACCOUNT" --block "$SNAPSHOT_BLOCK"`, check it equals the leaf's `balance`, and check `amount == floor(distributable * balance / eligibleBalance)`.
6. To prove completeness, rebuild every holder's balance from the token's `Transfer` logs up to the snapshot block (a mint adds to the receiver, a burn subtracts from the sender; the sum equals `totalSupply()` at that block). Drop the manifest's `excluded` addresses and balances below `minBalance`. The remaining balances must sum to `eligibleBalance`, and every holder whose formula amount is not zero must have that amount.
7. For a referral round, each leaf's `amount` must equal the sum of that account's entries in `rule.rewards`.
8. To check a claim, `claimed(asset, account)` plus what is still owed must equal the account's `cumulative` in the latest root, and `totalClaimed(asset)` can never exceed `cumulativeTotal(asset)`.
