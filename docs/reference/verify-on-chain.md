---
title: Verify on-chain
order: 17
---

# Verify on-chain

Everything Claire's protocol does is on a public chain, so you can check a launch, its payee, a time lock, a revenue lock, a price lock, a router's revenue split and a distribution round yourself, without trusting Claire's API or pages. This guide uses the SDK's `@tryclaire/sdk/protocol` subpath first, then shows how to do each check without the SDK.

> [!IMPORTANT]
> The protocol contracts are not deployed to any public network yet, so there is nothing to verify on a public chain today. Contract addresses are published with each deployment, in the `deployments` map of `@tryclaire/sdk/protocol` and on this site. Take addresses from there, never from a page or message that only claims to be Claire. The contracts are described in the [protocol contract reference](protocol-contracts.md).

## What you need

- An RPC endpoint for each chain involved. Balance checks at a past block need an archive-capable endpoint. A round that pays on Ethereum can use a snapshot of $CLAIRE taken on Robinhood Chain, so you can need both.
- The addresses of the deployment you are checking: the router factory, token lock, revenue lock, price lock, vault factory and proof view, plus the token, router or distributor you are checking. The deployment block is a safe lower bound for event scans.
- For the SDK: Node.js 22 or newer and `@tryclaire/sdk` 0.6.0 or later, with [`viem`](https://viem.sh), an optional peer dependency that only the protocol subpath needs. The root API client stays dependency-free. Version 0.6.0 targets Claire v3 and is a breaking change from 0.5.0: the distributor ABI, leaf encoding and round manifest changed.

```sh
npm install @tryclaire/sdk viem
```

## Verify with the SDK

Every function takes explicit addresses and a viem `PublicClient`, pins one block so all fields describe the same state, and returns `{ ok, checks: [{ id, ok, detail }], facts }`. A read that fails, such as an address that is not the expected contract, is reported as a failed check instead of a crash. Event scans run from `fromBlock` (default `0n`; set it to the deployment block) in `chunk`-sized requests (default `10_000n`).

```js
import { createPublicClient, http, zeroAddress } from "viem";
import {
  readProof, verifyLaunch, verifyLock, verifyPriceLock, verifyRevenueLock,
  verifyRouterSplit, verifyRound, verifySplit, verifyVestingVault,
} from "@tryclaire/sdk/protocol";

const client = createPublicClient({ transport: http(process.env.RPC_URL) });
// The addresses of the published deployment for this chain.
const { routerFactory, tokenLock, revenueLock, priceLock, vaultFactory, proofView } = addresses;
const fromBlock = 1234n; // the deployment block
```

### Verify a launch

```js
const launch = await verifyLaunch(client, { token, routerFactory, vaultFactory, fromBlock });
```

Checks that the factory records the token against a router it deployed, that the router launched exactly this token, that the router's creator, payee, treasury, $CLAIRE holder distributor, fee token, launch fee, launchpad addresses, pons buyback vault and (on Stockereum) pool ID equal the factory's and its `RouterDeployed` event, that its holder share is within the limit and consistent with its holder distributor, and that exactly one `Launched` event matches. With `vaultFactory`, `launch.facts.payeeKind` is `creator`, `vault`, `split` or `other`: a payee that is a vault or split must have been recorded by `ClaireVaultFactory`. `launch.facts.router` is the router for the next checks.

### Verify a router split

```js
const split = await verifyRouterSplit(client, { router: launch.facts.router, fromBlock });
```

Recomputes the split of every `Distributed` event from its charged revenue and compares it with the router's own `split()`; the creator share goes to the router's `payee`. Revenue in the quote asset and, on pons, in the launch token (buyback vests) is counted, and revenue charged in any other asset fails. Scanning from the router's first block also ties the summed revenue to `totalRevenue(asset)`; from a later block the sum is only a lower bound.

### Verify the payee

```js
const vault = await verifyVestingVault(client, {
  vault: launch.facts.launch.payee, vaultFactory, assets: [launch.facts.launch.quote, zeroAddress], fromBlock,
});
const share = await verifySplit(client, { split: launch.facts.launch.payee, vaultFactory, assets: [launch.facts.launch.quote, zeroAddress], fromBlock });
```

Use the one that matches `payeeKind`. `verifyVestingVault` checks that the vault is genuine (the factory recorded it and its CREATE2 `predictVault` from the `VaultDeployed` event is the vault) and, per asset (`zeroAddress` is ETH), recomputes `vested`, `releasable` and `released`, and ties `released` to the `Released` events. `verifySplit` checks `isSplit` and `predictSplit` from `SplitDeployed`, that the shares are 2 to 10 payees summing to 10,000 basis points, and, per asset, recomputes every payee's paid amount, the releasable remainder and the total paid, tied to the `Released` events.

### Verify a lock

```js
const lock = await verifyLock(client, { tokenLock, lockId: 0n, routerFactory, fromBlock });
```

Recomputes the schedule and vested amount at the pinned block, ties the lock to its `LockCreated` event and checks the contract holds the tokens it owes. `facts.cancelState` reports the notice-period state (`not-cancelable`, `cancelable`, `notice-not-requested`, `notice-pending`, `cancel-open` or `canceled`), and `cancelNotice`, `cancelAt` and `canceled` must match the lock's `CancelRequested` and `Canceled` events. With `routerFactory`, a lock funded by the token's own router with a matching `OpeningBuyLocked` event is flagged `facts.openingBuy`, and a locked opening buy must not be cancelable.

### Verify a revenue lock

```js
const revenue = await verifyRevenueLock(client, { revenueLock, lockId: 0n, fromBlock });
```

Checks that the tranches are valid (1 to 10, increasing thresholds, shares summing to 10,000 basis points), that the registry records the lock's router for the token, that router's quote asset and token match, and recomputes `totalRevenue - baseline` and the unlocked amount from the router itself. It also ties the lock, its baseline and its tranches to `RevenueLockCreated`. Remember what the number measures: [revenue is everything the router collects from the launchpad's escrow, including third-party credits](../sources/token-actions.md#revenue-locks).

### Verify a price lock

```js
const price = await verifyPriceLock(client, { priceLock, lockId: 0n, routerFactory, fromBlock: 0n });
```

Checks that the token is Claire-launched and that the tranches are valid, then recomputes from the `Sampled` events the hourly minimum samples, the window minimum (24 completed hours, each with a sample), the `highWater` ratchet and the unlocked amount, and compares them with the contract. `highWater` is only proven by a scan from block `0` (or from the price lock's deployment block); from a later block it is not independently confirmed. Remember what the number measures: [a price lock is a sampled-price trigger, not an oracle](../sources/token-actions.md#price-target-locks).

### Read a token's proof

```js
const proof = await readProof(client, { proofView, token });
```

One `ClaireProofView` call: whether the token is Claire-launched, its router, launchpad, creator, payee, holder share and buyback flag, the router's revenue per quote and launch token, the amounts locked in the token lock, revenue lock and price lock, and on pons the supply the launchpad's locker holds permanently. It reads one pinned block and is a convenient summary, not a replacement for the verifiers above.

### Verify a distribution round

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

`<chainId>` is the distributor's chain and `<evidence>` is the round's `0x`-prefixed hash. The same URL is returned as `manifestUrl` by the [rounds endpoint](developer-api.md#read-token-locks-fee-routers-and-rounds). Hash the bytes you downloaded, not a re-serialized copy: key order and whitespace matter. This is manifest version 2, the only version; version 1 manifests do not exist for the v3 distributor. Keys appear in the order below, with no whitespace:

```json
{ "kind": "claire-round", "version": 2, "purpose": "airdrop",
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

## Verify without the SDK

You need only an RPC endpoint and a tool that can read contracts and compute keccak-256. The examples use [Foundry's `cast`](https://book.getfoundry.sh/cast/); anything else works the same way. The contract functions and events are in the [protocol contract reference](protocol-contracts.md), and the ABIs are exported by `@tryclaire/sdk/protocol`.

**A launch.** Read `launchRouterOf(token)` and `isRouter(router)` on the factory. Read `launchedToken()` and `registry()` on the router and require your token and the factory. Compare the router's `treasury()`, `claireHolderDistributor()`, `feeToken()`, `launchFee()` and `buybackVault()` with the factory's, and look for exactly one `Launched` log from the router and one `RouterDeployed` log from the factory naming the router's `creator()` and `payee()`.

```sh
cast call "$FACTORY" "launchRouterOf(address)(address)" "$TOKEN" --rpc-url "$RPC_URL"
cast call "$FACTORY" "isRouter(address)(bool)" "$ROUTER" --rpc-url "$RPC_URL"
cast call "$ROUTER" "launchedToken()(address)" --rpc-url "$RPC_URL"
cast call "$ROUTER" "payee()(address)" --rpc-url "$RPC_URL"
```

**A payee.** If `payee()` differs from `creator()`, ask the vault factory whether it recorded it, then read its terms and recompute what is owed.

```sh
cast call "$VAULT_FACTORY" "isVault(address)(bool)" "$PAYEE" --rpc-url "$RPC_URL"
cast call "$VAULT_FACTORY" "isSplit(address)(bool)" "$PAYEE" --rpc-url "$RPC_URL"
cast call "$PAYEE" "vested(address)(uint256)" "$ASSET" --rpc-url "$RPC_URL"     # vault
cast call "$PAYEE" "payees()(address[])" --rpc-url "$RPC_URL"                   # split
cast call "$PAYEE" "shares()(uint16[])" --rpc-url "$RPC_URL"
```

A vault vests `totalReceived * clamp((t - start) / (end - start))` per asset, with nothing before `cliff`; `totalReceived` is its balance plus `released(asset)`. A split pays payee `i` `floor(totalReceived * shares[i] / 10000)` minus `paid(asset, i)`. Both match their `Released` logs.

**A router split.** Fetch the router's `Distributed(asset, received, revenue, creatorAmount, projectHolderAmount, claireHolderAmount, treasuryAmount)` logs and recompute each with the [fee rules](protocol-contracts.md#fee-rules) using the router's `holderBps()`. `creatorAmount` is the payee's share and also includes `received - revenue`. Summed from the first block, the `revenue` of each asset (the quote asset and, on pons, the launch token) equals `totalRevenue(asset)`.

```sh
cast logs --address "$ROUTER" --from-block "$DEPLOY_BLOCK" --rpc-url "$RPC_URL" \
  "Distributed(address,uint256,uint256,uint256,uint256,uint256,uint256)"
cast call "$ROUTER" "totalRevenue(address)(uint256)" "$ASSET" --rpc-url "$RPC_URL"
```

**A lock.** Read the lock and recompute the vested amount from its schedule, then compare it with `LockCreated` and require the contract's token balance to cover `locked(token)`.

```sh
cast call "$TOKEN_LOCK" "getLock(uint256)((address,address,address,uint128,uint128,uint40,uint40,uint40,bool,bool,bool,uint32,uint40))" 0 --rpc-url "$RPC_URL"
cast call "$TOKEN_LOCK" "claimableAmount(uint256)(uint128)" 0 --rpc-url "$RPC_URL"
```

The fields are `token, funder, beneficiary, amount, claimed, start, cliff, end, cancelable, transferable, canceled, cancelNotice, cancelAt`. A cancelable lock with a non-zero `cancelNotice` can be canceled only from `cancelAt`, which is set by the funder's `CancelRequested` event; `cancelAt` is `0` until it is requested. For an opening-buy lock, the funder is the token's router, `cancelable` is `false`, and the router logged `OpeningBuyLocked(token, lockId, amount)`.

**A revenue lock.** Read the lock and its tranches, read the router's `totalRevenue(asset)` yourself, and recompute `earned = totalRevenue - baseline` and the unlocked amount.

```sh
cast call "$REVENUE_LOCK" "getLock(uint256)((address,address,address,address,address,uint128,uint128,uint256,uint40,uint256))" 0 --rpc-url "$RPC_URL"
cast call "$REVENUE_LOCK" "getTranches(uint256)((uint128,uint16)[])" 0 --rpc-url "$RPC_URL"
cast call "$ROUTER" "totalRevenue(address)(uint256)" "$ASSET" --rpc-url "$RPC_URL"
```

The lock fields are `token, funder, beneficiary, router, asset, amount, claimed, baseline, deadline, trancheSet`. Require that `launchRouterOf(token)` on the registry (the lock's `registry()`) is the lock's `router`, and that the router's `quote()` is its `asset`.

**A price lock.** Read the lock and its tranches, then the token's `highWater`, `windowMin` and `lastSample` from the price lock. Rebuild the window from the `Sampled(token, price, windowMin, windowFull, highWater)` logs: each poke lowers its hour's recorded minimum, and the window minimum is the lowest of the last 24 completed hours that each have a sample. A tranche is unlocked once `highWater >= price`, or everything once `deadline` has passed.

```sh
cast call "$PRICE_LOCK" "getLock(uint256)((address,address,address,uint128,uint128,uint40,uint256))" 0 --rpc-url "$RPC_URL"
cast call "$PRICE_LOCK" "getTranches(uint256)((uint256,uint16)[])" 0 --rpc-url "$RPC_URL"
cast call "$PRICE_LOCK" "highWater(address)(uint256)" "$TOKEN" --rpc-url "$RPC_URL"
cast call "$PRICE_LOCK" "windowMin(address)(uint256,bool)" "$TOKEN" --rpc-url "$RPC_URL"
```

The lock fields are `token, funder, beneficiary, amount, claimed, deadline, trancheSet`. `highWater` is a running maximum, so only a scan of every `Sampled` log from the price lock's deployment proves it.

**A distribution round.**

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
