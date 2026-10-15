---
title: Verify on-chain
order: 17
---

# Verify on-chain

Everything Claire's protocol does is on a public chain, so you can check a launch, a lock, a revenue lock, a router's revenue split and a distribution round yourself, without trusting Claire's API or pages. This guide uses the SDK's `@tryclaire/sdk/protocol` subpath first, then shows how to do each check without the SDK.

> [!IMPORTANT]
> The protocol contracts are not deployed to any public network yet, so there is nothing to verify on a public chain today. Contract addresses are published per chain in the protocol repository's [`deployments/`](https://github.com/tryclaire/protocol/tree/main/deployments) folder once they exist. Take addresses from there, never from a page or message that only claims to be Claire. The contracts are described in the [protocol contract reference](protocol-contracts.md).

## What you need

- An RPC endpoint for each chain involved. Balance checks at a past block need an archive-capable endpoint. A distribution round of a Robinhood Chain token can use a snapshot taken on Ethereum, so you can need both.
- The addresses: the router factory, token lock and revenue lock from the chain's deployment manifest, plus the token, router or distributor you are checking. The deployment block (`block` in the manifest) is a safe lower bound for event scans.
- For the SDK: Node.js 22 or newer and `@tryclaire/sdk` 0.5.0 or later, with [`viem`](https://viem.sh), an optional peer dependency that only the protocol subpath needs. The root API client stays dependency-free.

```sh
npm install @tryclaire/sdk viem
```

## Verify with the SDK

Every function takes explicit addresses and a viem `PublicClient`, pins one block so all fields describe the same state, and returns `{ ok, checks: [{ id, ok, detail }], facts }`. A read that fails, such as an address that is not the expected contract, is reported as a failed check instead of a crash. Event scans run from `fromBlock` (default `0n`; set it to the deployment block) in `chunk`-sized requests (default `10_000n`).

```js
import { createPublicClient, http } from "viem";
import {
  verifyLaunch, verifyLock, verifyRevenueLock, verifyRouterSplit, verifyRound,
} from "@tryclaire/sdk/protocol";

const client = createPublicClient({ transport: http(process.env.RPC_URL) });
const { routerFactory, tokenLock, revenueLock } = deployment; // from the protocol repo's deployments/<chainId>.json
const fromBlock = BigInt(deployment.block);
```

### Verify a launch

```js
const launch = await verifyLaunch(client, { token, routerFactory, tokenLock, fromBlock });
```

Checks that the factory records the token against a router it deployed, that the router launched exactly this token, that the router's treasury, $CLAIRE holder distributor, fee token, launch fee and launchpad addresses equal the factory's, that its holder share is within the limit and consistent with its holder distributor, and that exactly one `Launched` event matches. `launch.facts.router` is the router for the next checks.

### Verify a router split

```js
const split = await verifyRouterSplit(client, { router: launch.facts.router, fromBlock });
```

Recomputes the split of every `Distributed` event from its charged revenue and compares it with the router's own `split()`. Scanning from the router's first block also ties the summed revenue to `totalRevenue(asset)`; from a later block the sum is only a lower bound.

### Verify a lock

```js
const lock = await verifyLock(client, { tokenLock, lockId: 0n, routerFactory, fromBlock });
```

Recomputes the schedule and vested amount at the pinned block, ties the lock to its `LockCreated` event and checks the contract holds the tokens it owes. With `routerFactory`, a lock funded by the token's own router with a matching `OpeningBuyLocked` event is flagged `facts.openingBuy`, and a locked opening buy must not be cancelable.

### Verify a revenue lock

```js
const revenue = await verifyRevenueLock(client, { revenueLock, lockId: 0n, fromBlock });
```

Checks that the tranches are valid (1 to 10, increasing thresholds, shares summing to 10,000 basis points), that the registry records the lock's router for the token, that router's quote asset and token match, and recomputes `totalRevenue - baseline` and the unlocked amount from the router itself. It also ties the lock, its baseline and its tranches to `RevenueLockCreated`. Remember what the number measures: [revenue is everything the router collects from the launchpad's escrow, including third-party credits](../sources/token-actions.md#revenue-locks).

### Verify a distribution round

```js
const round = await verifyRound(client, {
  distributor, roundId: 0n, level: "complete",
  manifestBaseUrl: "https://app.tryclaire.net", // or pass `manifest`, the exact string you saved
  snapshotClient,                               // only when the snapshot is on another chain
});
if (!round.ok) console.log(round.checks.filter((check) => !check.ok));
```

The levels build on each other:

| Level | What it proves |
| --- | --- |
| `manifest` (default) | The manifest's keccak-256 equals the round's on-chain `evidence`; its leaves rebuild the on-chain Merkle root and total; its chain, distributor, asset and snapshot block match the round; every account appears once. |
| `balances` | Adds: each leaf's `balance` equals `balanceOf` at the snapshot block on the snapshot chain, and every amount equals `floor(distributable * balance / eligibleBalance)`, with `eligibleBalance` covering the listed balances. |
| `complete` | Adds: a chunked `Transfer` scan of the snapshot token up to the snapshot block. After the manifest's exclusions and minimum balance, the eligible balances must sum to `eligibleBalance`, and the leaves must be exactly the holders whose share is not zero. |

Referral rounds carry their rewards in the manifest instead of balances, and each leaf must equal that account's reward sum. The hashing helpers are exported as well: `roundLeafHash`, `merkleRoot`, `merkleProof` and `manifestEvidence`.

Verification shows that a round matches its published manifest and the chain's balances. It cannot show that the excluded addresses were the right ones to exclude; the manifest lists them so you can judge.

## The round manifest

Every distributor round, whatever its purpose (`project-holders`, `claire-holders`, `airdrop` or `referrals`), has one manifest. The on-chain `evidence` is

```text
evidence = keccak256( UTF-8 bytes of the manifest JSON, exactly as served )
```

Claire stores the exact string and serves it verbatim and unauthenticated, with an immutable cache:

```text
GET https://app.tryclaire.net/rounds/<chainId>/<distributor, lowercase>/<evidence>.json
```

`<chainId>` is the distributor's chain and `<evidence>` is the round's `0x`-prefixed hash. The same URL is returned as `manifestUrl` by the [rounds endpoint](developer-api.md#read-token-locks-fee-routers-and-rounds). Hash the bytes you downloaded, not a re-serialized copy: key order and whitespace matter. Keys appear in the order below, with no whitespace:

```json
{ "kind": "claire-round", "version": 1, "purpose": "airdrop",
  "chainId": 4663, "distributor": "0x…", "asset": "0x…", "total": "1000000",
  "snapshot": { "chainId": 1, "block": "12345678", "token": "0x…" },
  "rule": { "type": "pro-rata", "distributable": "1000000", "eligibleBalance": "5000000",
            "excluded": ["0x…"], "minBalance": null },
  "leaves": [ { "index": 0, "account": "0x…", "amount": "200000", "balance": "1000000" } ] }
```

(Shown with whitespace for reading; the served string has none.)

| Field | Meaning |
| --- | --- |
| `chainId`, `distributor`, `asset` | The chain, distributor contract and payout asset. Addresses are lowercase. |
| `total` | Raw units the round pays: the sum of the leaves' `amount`, equal to the round's on-chain `total`. |
| `snapshot` | Chain and block of the balances, and the token whose balances were read. `token` is `null` for referral rounds. |
| `rule` | `pro-rata`: `distributable` (the amount split), `eligibleBalance` (sum of every eligible balance, including holders whose share rounds to zero, so rounding dust stays in the distributor), `excluded` (sorted lowercase addresses removed before splitting) and `minBalance` (raw units or `null`; airdrops set their minimum $CLAIRE balance). `referral-rewards`: `rewards`, a list of `[account, amount, [reward IDs, sorted]]`. |
| `leaves` | In index order. `amount` is exactly what the Merkle leaf commits to; `balance` is the holder's snapshot balance, `null` for referral rounds. |

**Pro-rata formula**, per eligible holder with snapshot `balance`:

```text
amount = floor( distributable * balance / eligibleBalance )
```

A holder whose amount is zero gets no leaf. **Leaf hash** and **tree**, the same as `ClaireDistributor.leaf` and its claim-time verification:

```text
leaf = keccak256( keccak256( abi.encode(uint256 chainId, address distributor,
                 uint256 roundId, uint256 index, address account, uint128 amount) ) )
node = keccak256( abi.encode(smaller, larger) )      // sorted pair of child hashes
```

Level 0 is the leaf hashes in index order. Each level hashes neighbours `(2i, 2i+1)` as a sorted pair; an unpaired last node moves up unchanged. The single node at the top is the round's `root`. Leaves bind the chain, distributor and round, so a proof cannot be replayed elsewhere.

## Verify without the SDK

You need only an RPC endpoint and a tool that can read contracts and compute keccak-256. The examples use [Foundry's `cast`](https://book.getfoundry.sh/cast/); anything else works the same way. The contract functions and events are in the [protocol contract reference](protocol-contracts.md), and the ABIs are in the protocol repository's [`abi/`](https://github.com/tryclaire/protocol/tree/main/abi) folder.

**A launch.** Read `launchRouterOf(token)` and `isRouter(router)` on the factory. Read `launchedToken()` and `registry()` on the router and require your token and the factory. Compare the router's `treasury()`, `claireHolderDistributor()`, `feeToken()` and `launchFee()` with the factory's, and look for exactly one `Launched` log from the router.

```sh
cast call "$FACTORY" "launchRouterOf(address)(address)" "$TOKEN" --rpc-url "$RPC_URL"
cast call "$FACTORY" "isRouter(address)(bool)" "$ROUTER" --rpc-url "$RPC_URL"
cast call "$ROUTER" "launchedToken()(address)" --rpc-url "$RPC_URL"
```

**A router split.** Fetch the router's `Distributed(asset, received, revenue, creatorAmount, projectHolderAmount, claireHolderAmount, treasuryAmount)` logs and recompute each with the [fee rules](protocol-contracts.md#fee-rules) using the router's `holderBps()`. The creator amount also includes `received - revenue`. Summed from the first block, the `revenue` of each asset equals `totalRevenue(asset)`.

```sh
cast logs --address "$ROUTER" --from-block "$DEPLOY_BLOCK" --rpc-url "$RPC_URL" \
  "Distributed(address,uint256,uint256,uint256,uint256,uint256,uint256)"
cast call "$ROUTER" "totalRevenue(address)(uint256)" "$ASSET" --rpc-url "$RPC_URL"
```

**A lock.** Read the lock and recompute the vested amount from its schedule, then compare it with `LockCreated` and require the contract's token balance to cover `locked(token)`.

```sh
cast call "$TOKEN_LOCK" "getLock(uint256)((address,address,address,uint128,uint128,uint40,uint40,uint40,bool,bool,bool))" 0 --rpc-url "$RPC_URL"
cast call "$TOKEN_LOCK" "claimableAmount(uint256)(uint128)" 0 --rpc-url "$RPC_URL"
```

The fields are `token, funder, beneficiary, amount, claimed, start, cliff, end, cancelable, transferable, canceled`. For an opening-buy lock, the funder is the token's router, `cancelable` is `false`, and the router logged `OpeningBuyLocked(token, lockId, amount)`.

**A revenue lock.** Read the lock and its tranches, read the router's `totalRevenue(asset)` yourself, and recompute `earned = totalRevenue - baseline` and the unlocked amount.

```sh
cast call "$REVENUE_LOCK" "getLock(uint256)((address,address,address,address,address,uint128,uint128,uint256,uint40,uint256))" 0 --rpc-url "$RPC_URL"
cast call "$REVENUE_LOCK" "getTranches(uint256)((uint128,uint16)[])" 0 --rpc-url "$RPC_URL"
cast call "$ROUTER" "totalRevenue(address)(uint256)" "$ASSET" --rpc-url "$RPC_URL"
```

The lock fields are `token, funder, beneficiary, router, asset, amount, claimed, baseline, deadline, trancheSet`. Require that `launchRouterOf(token)` on the registry (the lock's `registry()`) is the lock's `router`, and that the router's `quote()` is its `asset`.

**A distribution round.**

1. Read the round: `getRound(roundId)` returns `(asset, total, claimed, root, snapshotBlock, evidence)`.
2. Download the manifest from the URL above, saved byte for byte. Check that `keccak256` of its bytes equals `evidence`. `cast keccak` hashes text as UTF-8, and the manifest starts with `{`:

   ```sh
   cast call "$DISTRIBUTOR" "getRound(uint256)((address,uint128,uint128,bytes32,uint64,bytes32))" 0 --rpc-url "$RPC_URL"
   cast keccak "$(cat manifest.json)"
   ```

3. Check the manifest's `chainId`, `distributor`, `asset`, `total` and `snapshot.block` against the chain and the round, and that the leaf amounts sum to `total`.
4. Compute each leaf hash and rebuild the tree as described above. The root must equal the on-chain `root`. For one leaf:

   ```sh
   cast keccak "$(cast keccak "$(cast abi-encode 'f(uint256,address,uint256,uint256,address,uint128)' \
     "$CHAIN_ID" "$DISTRIBUTOR" "$ROUND_ID" "$INDEX" "$ACCOUNT" "$AMOUNT")")"
   ```

   The distributor's own `leaf(roundId, index, account, amount)` view returns the same value.
5. For a pro-rata round, read each leaf's balance at the snapshot block on the snapshot chain with `cast call "$TOKEN" "balanceOf(address)(uint256)" "$ACCOUNT" --block "$SNAPSHOT_BLOCK"`, check it equals the leaf's `balance`, and check `amount == floor(distributable * balance / eligibleBalance)`.
6. To prove completeness, rebuild every holder's balance from the token's `Transfer` logs up to the snapshot block (a mint adds to the receiver, a burn subtracts from the sender; the sum equals `totalSupply()` at that block). Drop the manifest's `excluded` addresses and balances below `minBalance`. The remaining balances must sum to `eligibleBalance`, and the leaves must be exactly the holders whose formula amount is not zero.
7. For a referral round, each leaf's `amount` must equal the sum of that account's entries in `rule.rewards`.
