---
title: Protocol contract reference
order: 16
---

# Protocol contract reference

The Claire protocol is twelve Solidity contracts. None has an owner, admin, pause, upgrade path or arbitrary call, and every parameter is fixed at deployment except two on each router, which only the router's creator can change: the holder share can only go up, and the payee changes only after 7 days' public notice. Nobody can leave Claire: no function moves a router's launchpad fee recipient. Contract names below are the Solidity names.

> [!IMPORTANT]
> Addresses are published per chain in the `deployments` map of [`@tryclaire/sdk/protocol`](verify-on-chain.md) and on this site. Never use an address from any other source.

Supported launchpad: pons v2 on Robinhood Chain (chain ID `4663`, USDG fees). Stockereum v3 on Ethereum (chain ID `1`, USDC fees) is implemented in the contracts but is coming soon and not available to use. See [Token actions](../sources/token-actions.md#claire-protocol-fees) for the product behavior and [Verify on-chain](verify-on-chain.md) to check any of it yourself.

## ABIs

The ABIs of all twelve contracts ship typed in [`@tryclaire/sdk/protocol`](verify-on-chain.md) (`claireFeeRouterAbi`, `claireRouterFactoryAbi`, `claireRouterDeployerAbi`, `claireDistributorAbi`, `claireDistributorFactoryAbi`, `claireTokenLockAbi`, `claireRevenueLockAbi`, `clairePriceLockAbi`, `claireVestingVaultAbi`, `claireSplitAbi`, `claireVaultFactoryAbi` and `claireProofViewAbi`), exported as `as const` values you can pass straight to viem. Install version 0.7.0 or later.

## How they fit together

| Contract | Created | Purpose |
| --- | --- | --- |
| `ClaireRouterFactory` | Once per chain | Deploys each launch's fee router and holder distributor at predictable addresses, and is the registry of Claire-launched tokens. |
| `ClaireRouterDeployer` | Once per chain | Holds the router's creation code and creates routers for the factory, so the factory stays under the contract size limit. |
| `ClaireFeeRouter` | Once per launch | The launch's only launcher and creator-fee recipient (or the adopter of an existing pons token). Splits the trading revenue it collects, including pons buyback tokens. |
| `ClaireDistributor` | Per recipient group | Pays a group (project holders, $CLAIRE holders, an airdrop, referrers) from cumulative Merkle roots. |
| `ClaireDistributorFactory` | Once per chain | Deploys distributors at CREATE2 addresses. |
| `ClaireTokenLock` | Once per chain | Timelock, linear and catch-up-cliff token locks, with notice-period cancel. |
| `ClaireRevenueLock` | Once per chain | Locks of Claire-launched tokens that unlock as revenue grows. |
| `ClairePriceLock` | Once per chain | Locks of Claire-launched tokens that unlock as a sampled market price holds. |
| `ClaireVestingVault` | Per payee | A payee that vests everything it receives to one beneficiary. |
| `ClaireSplit` | Per payee | A payee that divides everything it receives between 2 to 10 wallets. |
| `ClaireVaultFactory` | Once per chain | Deploys vaults and splits and records them, so a payee can be verified. |
| `ClaireProofView` | Once per chain | Stateless: one call returns a token's verifiable Claire facts. |

Fees are fixed amounts of one 6-decimal USD stablecoin per chain (`launchFee` 10, `migrationFee` 25 and `lockFee` 25, in whole units) plus a share of trading revenue. The stablecoin is assumed to hold its peg; there is no oracle.

## Fee rules

Trading revenue `R` is everything a router claims from the launchpad's fee escrow, per asset, in that asset: the quote asset and, on pons with buyback on, the launch token the buyback vests to the router. `ClaireFeeRouter.split(R)` with `CLAIRE_SHARE_BPS = 1000`, `BPS = 10000` and the router's current `holderBps` (0 to 9000; the creator can raise it, never lower it):

```text
claire        = R * 1000 / 10000
projectHolder = R * holderBps / 10000
claireHolders = claire / 2
treasury      = claire - claireHolders
payee         = R - claire - projectHolder      (all rounding dust)
```

The split uses the `holderBps` and `payee` in effect when revenue is distributed. Fees the router has earned so far are harvested and distributed under the old values before a change takes effect, so each `Distributed` event follows one unambiguous split.

Claire's 10% applies to everything the router receives, including vested buyback tokens, and is deducted only from the creator's share. The quote that pons diverts to the buyback is never a router receipt, so it is never charged. Anything that does not arrive through the escrow claim (direct transfers, launch change, refunds) goes to the payee in full and is never charged. A permissionless credit to the router's pons escrow balance cannot be told apart from revenue and is treated as revenue. For a migrated token this holds only from [the adoption cutoff](#adoption-cutoff) on.

| Action | Fee |
| --- | --- |
| Launch through Claire | USD 10 stablecoin, half treasury and half $CLAIRE holders, only if the launch succeeds. |
| Bring an existing pons token to Claire (`adopt`) | USD 25 stablecoin (`migrationFee`), half treasury and half $CLAIRE holders, once, atomically with the adoption. |
| Lock of a token launched elsewhere | USD 25 per `createLocks` call, however many beneficiaries. |
| Lock of a token launched or adopted through Claire, including the opening-buy lock | None. |
| Revenue lock, price lock | None. |
| Vesting vault, split, their factory | None. |
| Claim, cancel, beneficiary transfer, release, airdrop and referral claims | Gas only. |

## ClaireRouterFactory

Deploys per launch a `ClaireFeeRouter` (through the `ClaireRouterDeployer`) and the project's `ClaireDistributor` (through the distributor factory), always both, also when the holder share starts at 0 so the creator can raise it later. Both are at CREATE2 addresses that `predict` returns before the launch. It is also the registry of Claire-launched tokens, launched or adopted: only routers it deployed can register, once per token. It holds no funds.

**Immutables:** `claireHolderDistributor`, `treasury`, `ponsFactory`, `ponsEscrow`, `ponsLaunchRouter`, `ponsBuybackVault`, `stockereumFactory`, `stockereumEscrow`, `feeToken`, `launchFee`, `migrationFee`, `tokenLock`, `distributors`, `routers` (the `ClaireRouterDeployer`).

Functions:

| Function | Purpose |
| --- | --- |
| `deploy(launchpad, creator, payee, publisher, holderBps, salt)` | Deploys the router and holder distributor; read it with `router.projectHolderDistributor()`. `creator` is the launcher; `payee` receives the creator share at first (the creator itself when it chooses none; the zero address is refused); `holderBps` is the starting holder share. The creator can change both later, within the limits [below](#changing-the-split). `publisher` is who may publish project-holder rounds. Deploying the same arguments again returns the existing router. |
| `predict(launchpad, creator, payee, publisher, holderBps, salt)` | The router and distributor addresses `deploy` would produce, from the starting values. |
| `registerLaunch(token)` | Called by a router after its launch or adoption. Only a router this factory deployed may call it. |
| `launchRouterOf(token)`, `isClaireLaunched(token)`, `isRouter(router)` | The registry reads. |
| `deployAirdrop(token, reclaimAfter, salt)` | Deploys an airdrop distributor for a Claire-launched token. Only that launch's creator may call it; it becomes the publisher. `reclaimAfter` is a required future timestamp. |
| `predictAirdrop(token, creator, reclaimAfter, salt)`, `airdropTokenOf(distributor)` | The address `deployAirdrop` would produce, and the token an airdrop distributor belongs to. |

**Events:** `RouterDeployed(router, creator, payee, projectHolderDistributor, launchpad, holderBps, salt)`, `ClaireLaunchRegistered(token, router)`, `AirdropDeployed(token, distributor, creator, salt)`.

**Errors:** `InvalidConfiguration`, `UnsupportedLaunchpad`, `NotRouter`, `AlreadyRegistered(token)`, `NotLaunchCreator`.

## ClaireFeeRouter

One launch's creator-fee recipient and its only launcher. It carries out the launchpad launch (or adopts an existing pons token), pays the launch or migration fee, registers the token and splits all trading revenue it claims from the launchpad's escrow. It has no function that transfers the launchpad's creator-fee recipient.

**Immutables:** `launchpad` (`PonsV2` or `StockereumV3`), `launchFactory`, `launchRouter` (pons only), `escrow`, `buybackVault` (pons only), `registry`, `creator`, `projectHolderDistributor`, `claireHolderDistributor`, `treasury`, `feeToken`, `tokenLock`, `launchFee`, `migrationFee`; constants `BPS`, `CLAIRE_SHARE_BPS`, `MAX_HOLDER_BPS` (9000) and `PAYEE_DELAY` (7 days). `payee` and `holderBps` are state, not immutables.

The `creator` is the launcher: the only caller of `launchPons`, `launchStockereum`, `adopt` and `setBuyback`, and the recipient of opening-buy tokens and launch change (or the beneficiary of the locked opening buy). The `payee` receives the creator share of every distribution. It is an account, a `ClaireVestingVault` or a `ClaireSplit`, and starts as the deployment's payee; the creator can [change it with 7 days' notice](#changing-the-split).

**State:** `payee`, `holderBps`, `pendingPayee` and `payeeChangeAt` (the creator's proposed payee, or the zero address and `0` when none), `launchedToken`, `curve`, `ponsQuote`, `stockereumQuote`, `stockereumPoolId`, `migrationFee`, `historicalVest()`, `revenuePending(asset)`, `owed(payee, asset)`, `totalOwed(asset)` and `totalRevenue(asset)`, the cumulative revenue charged per asset (the quote asset and, on pons, the launch token). It never decreases and is what revenue locks read.

Functions:

| Function | Purpose |
| --- | --- |
| `launchPons(params, launchConfigId, pairToken, quoteIn, minTokensOut, exemptions, lock)` | Creator only, once. Launches on pons v2 with the router as creator-fee recipient. `params` carries the token's name, symbol, logo, description, socials, `creatorFeeRecipient` (must be the router), `creatorTaxBps`, `buybackEnabled`, `expectedEconomics` and `salt`. `launchConfigId` picks the bonding curve, `pairToken` the quote asset, `quoteIn` an optional opening buy, and `exemptions` the wallets exempt from the opening snipe tax. |
| `launchStockereum(params, minOut, withBuy, lock)` | Creator only, once. Launches on Stockereum v3 (Ethereum, coming soon and not available), never with holder-reward routing. |
| `setBuyback(enabled)` | Creator only, after a pons launch. Forwards the flag to the launchpad from the router, the only account it accepts it from. It cannot move fees. |
| `adopt(token)` | Creator only, once, while no token is bound, on a pons router only. Brings a token launched on pons outside Claire: the token's pons creator-fee recipient must already be this router, which the creator moves with pons' own `transferCreatorFeeRecipient`. Sets `launchedToken`, `curve` and `ponsQuote` as `launchPons` does, pulls `migrationFee` from the creator (half treasury, half $CLAIRE holders; `MigrationFeePaid`), registers the token and emits `Adopted(token, quote)`. See [the cutoff](#adoption-cutoff). |
| `harvest(asset)` | Anyone. `asset` is the quote or, on pons, the launch token. Sweeps what the launchpad allows, claims the router's escrow balance and distributes. For the launch token it first releases what the buyback vault has vested. |
| `distribute(asset)` | Anyone. Distributes funds already held, charging only revenue already claimed from the escrow. |
| `withdraw(asset)`, `withdrawTo(asset, to)` | A payee collects a payout a previous push could not deliver. |
| `withdrawFor(payee, asset)` | Anyone retries a payee's deferred payout; it always pays that payee itself (how a vault or split recovers one). |
| `split(revenue)` | The four-way split above, as a view. |
| `quote()` | The launch's quote asset (`address(0)` is native ETH). Reverts `NotBound` before the launch. |

`lock` is `OpeningLock(start, cliff, end, transferable)`. With `end == 0` the launch is a normal launch. With `end != 0` an opening buy is required, and every bought token is locked for the creator in `ClaireTokenLock`, never cancelable (see [Lock the opening buy](../sources/token-actions.md#lock-the-opening-buy)).

**Events:** `Launched(token, quote)`, `Adopted(token, quote)`, `StockereumLaunched(token, poolId, tokensToCreator)`, `LaunchFeePaid(payer, feeToken, amount, treasuryAmount, claireHolderAmount)`, `MigrationFeePaid(payer, feeToken, amount, treasuryAmount, claireHolderAmount)`, `HistoricalFeesPaid(asset, amount)`, `OpeningBuyLocked(token, lockId, amount)`, `BuybackSet(token, enabled)`, `RevenueCollected(asset, amount)`, `Distributed(asset, received, revenue, creatorAmount, projectHolderAmount, claireHolderAmount, treasuryAmount)`, `PayoutDeferred(payee, asset, amount)`, `Withdrawn(payee, asset, amount)`, `HolderShareRaised(oldBps, newBps)`, `PayeeChangeProposed(next, effectiveAt)`, `PayeeChangeCanceled(next)`, `PayeeChanged(oldPayee, newPayee)`. In `Distributed`, `creatorAmount` is the payee's share. `Adopted` replaces `Launched` for a [migrated token](../sources/token-actions.md#bring-a-linked-token-to-claire); a router emits one or the other, never both.

**Errors:** `InvalidConfiguration`, `Unauthorized`, `AlreadyBound`, `NotBound`, `OpeningBuyRequired`, `WrongLaunch`, `WrongAsset(asset)`, `HolderRoutingNotAllowed`, `NothingToDistribute(asset)`, `UnsweptFees`, `NoPendingPayee`, `PayeeChangeNotReady`.

### Changing the split

Only the router's `creator` can start a change, and no change can take a router out of Claire: the router never moves the launchpad's creator-fee recipient, Claire's 10% stays, and the holder share can never be lowered. Every router has these functions; there is no per-launch choice.

| Function | Purpose |
| --- | --- |
| `raiseHolderShare(newBps)` | Creator only. Instantly raises `holderBps` to `newBps`, which must be above the current share and at most `MAX_HOLDER_BPS`. Fees earned so far are first harvested and distributed under the old share, so the new share applies only to fees collected after the call. Emits `HolderShareRaised(oldBps, newBps)`. |
| `proposePayee(next)` | Creator only. Announces a new payee (not the zero address, not the current payee) that can take effect after `PAYEE_DELAY` (7 days). Replaces any pending proposal and restarts the delay. Emits `PayeeChangeProposed(next, effectiveAt)`; `pendingPayee` and `payeeChangeAt` show it. |
| `cancelPayee()` | Creator only. Withdraws the pending proposal (`NoPendingPayee` when none). Emits `PayeeChangeCanceled(next)`. |
| `applyPayee()` | Anyone, once `block.timestamp >= payeeChangeAt` (`PayeeChangeNotReady` before). Fees earned so far are first harvested and distributed to the current payee, so the order of `applyPayee` and `harvest` never matters; then the payee changes and the proposal clears. Emits `PayeeChanged(oldPayee, newPayee)`. Payouts the old payee was already owed stay its own: `withdraw`, `withdrawTo` and `withdrawFor` keep working for it. |

The new payee can be an account, a [vault or split](#clairevestingvault); the router does not check what it is, so [verify](verify-on-chain.md#verify-the-payee) it before relying on it.

### Adoption cutoff

Adoption is a clean cutoff. Only revenue the router receives after it is charged and counted in `totalRevenue`; what the token earned before is paid to the creator uncharged.

1. `adopt` first runs the router's sweep as the new recipient (curve fees, or the canonical pool's quote fees after graduation). It then reverts `UnsweptFees` while creator-side fees or a buyback balance remain unswept on the curve or on the canonical pool, in either currency, that only the launchpad's operator can settle.
2. It claims the router's own pons escrow balance of the quote and the launch token, whatever arrived between the recipient move and `adopt`, and pays it to the creator. This is `HistoricalFeesPaid`, not revenue, so it never advances a revenue lock. A refused payout is deferred like any other.
3. It sets aside the creator's share of an existing buyback vest that is still unreleased as `historicalVest()`, `(totalLocked - totalReleased) * (10000 - protocolShareBps) / 10000` from the vest vault. The first `historicalVest()` launch tokens that `harvest(launchToken)` receives go to the creator uncharged (`HistoricalFeesPaid`); only buybacks after that count as revenue. The vault's per-release rounding can shift a few wei between the two.
4. The creator's own pons escrow balance is never touched. The router has no function that moves the recipient back; only the launchpad's administration can.

## ClaireRouterDeployer

Creates routers for the factory. A router lives at the CREATE2 address of this deployer, the factory's key and the router's creation code with its configuration, so `predict(key, config)` and the factory's `predict` agree. Only the registry named in the configuration can call `deploy(key, config)` (`NotRegistry` otherwise), so nobody can occupy a factory router's address. It is stateless and holds no funds. Read its address from `ClaireRouterFactory.routers()`.

## ClaireDistributor

Holds one recipient group's entitlement and pays it from cumulative roots. Per asset the immutable publisher posts a Merkle root over leaves `(chainId, distributor, asset, account, cumulativeAmount)` with `cumulativeTotal`, the most the group has ever been promised in that asset. The root replaces the asset's previous one; every root stays in the round history. A claim pays the account its cumulative amount minus what it already claimed, so one claim collects everything owed across all rounds. Funds leave only through claims, except for an airdrop's reclaim.

**Immutables:** `publisher`, `group` (a label of the recipient group) and `reclaimAfter` (`0` means never; airdrop distributors always set it).

Functions:

| Function | Purpose |
| --- | --- |
| `publish(asset, total, merkleRoot, snapshotBlock, evidence)` | Publisher only. Publishes a new root over funds the distributor already holds. `total` is the new `cumulativeTotal`. |
| `fundAndPublish(asset, total, merkleRoot, snapshotBlock, evidence)` | Same arguments. First pulls exactly the increase of the cumulative total from the publisher (ERC-20 only), so funding and publication are one transaction. |
| `claim(asset, account, cumulative, proof)` | Anyone. Verifies against the asset's latest root and pays `account` its cumulative amount minus what it already claimed. Funds go only to `account`. |
| `reclaim(asset)` | Publisher only, only from `reclaimAfter`. Takes back what the contract still holds. |
| `leaf(asset, account, cumulative)` | The leaf hash, `keccak256(keccak256(abi.encode(chainid, distributor, asset, account, cumulative)))`. |
| `getRound(roundId)`, `roundCount()`, `root(asset)`, `cumulativeTotal(asset)`, `totalClaimed(asset)`, `claimed(asset, account)`, `outstanding(asset)`, `unreserved(asset)`, `closed()` | Reads. A round is `(asset, snapshotBlock, cumulativeTotal, root, evidence)`. |

A publication needs `balance >= cumulativeTotal - totalClaimed` for the asset, and `cumulativeTotal` never decreases. A claim can never push `totalClaimed` past `cumulativeTotal` (`TotalExceeded`), so a root that over-promises cannot drain funds beyond the published total. From `reclaimAfter` claims and publication close. The publisher can misallocate a root it publishes, but cannot withdraw (before `reclaimAfter`), exceed funded balances, or replay a proof on another asset, distributor or chain. `snapshotBlock` is recorded, not checked. `evidence` is a commitment to the round's manifest, which you can check with [Verify on-chain](verify-on-chain.md#verify-a-distribution-round).

**Events:** `RoundPublished(roundId, asset, cumulativeTotal, root, snapshotBlock, evidence)`, `Claimed(asset, account, amount, cumulative, caller)`, `Reclaimed(asset, amount)`.

**Errors:** `Unauthorized`, `InvalidRound`, `InvalidProof`, `InsufficientFunds(asset, available, requested)`, `TotalExceeded(asset)`, `NothingToClaim(asset, account)`, `Closed`, `NotClosed`, `InvalidConfiguration`.

## ClaireDistributorFactory

Deploys distributors with CREATE2: `deploy(publisher, group, reclaimAfter, salt)` and `predict(deployer, publisher, group, reclaimAfter, salt)`. The caller is part of the salt, so the router factory's distributors cannot be pre-empted. It holds no state and no funds.

## ClaireTokenLock

Token allocation locks: an end-date timelock, linear vesting, or linear vesting with a cliff whose catch-up amount unlocks at the cliff. One contract holds many locks. These are token allocation locks, not liquidity-pool locks.

**Immutables:** `registry`, `feeToken`, `lockFee`, `treasury`, `claireHolderDistributor`.

Functions:

| Function | Purpose |
| --- | --- |
| `createLocks(token, schedule, allocations)` | Creates one lock per allocation (1 to 100) and pulls the exact total once. `schedule` is `(start, cliff, end, cancelable, transferable, cancelNotice)`. Timelock: `cliff == end`. Linear: `cliff == start`. `cancelNotice` is in seconds and only valid on a cancelable lock. Charges the lock fee once per call unless the registry records the token as Claire-launched. |
| `claim(lockId)` | Anyone. Pays what is claimable to the beneficiary. |
| `requestCancel(lockId)` | Funder only, only on a cancelable lock with a notice. Sets `cancelAt = now + cancelNotice`. |
| `cancel(lockId)` | Funder only, only on a cancelable lock, from `cancelAt` (immediately when the notice is `0`, with no request). Vested tokens stay claimable; the unvested remainder returns to the funder. |
| `transferBeneficiary(lockId, to)` | Beneficiary only, only if created transferable. |
| `getLock`, `lockCount`, `vestedAmount(lockId, timestamp)`, `claimableAmount`, `locked(token)` | Reads. `getLock` returns `token, funder, beneficiary, amount, claimed, start, cliff, end, cancelable, transferable, canceled, cancelNotice, cancelAt`. |

Vested amount: all of `amount` from `end` (or once canceled); `0` before `cliff` or `start`; otherwise `amount * (t - start) / (end - start)`, rounded down. The vested amount at cancellation is computed when `cancel` executes, so the beneficiary keeps vesting and can claim during the notice. A notice on a non-cancelable lock is refused, and opening-buy locks are never cancelable. Fee-on-transfer and rebasing tokens are rejected at funding.

**Events:** `LockCreated(lockId, token, beneficiary, funder, amount, start, cliff, end, cancelable, transferable, cancelNotice)`, `Claimed(lockId, beneficiary, caller, amount)`, `CancelRequested(lockId, funder, cancelAt)`, `Canceled(lockId, funder, refunded, stillClaimable)`, `BeneficiaryTransferred(lockId, from, to)`, `LockFeePaid(funder, token, amount)`.

**Errors:** `InvalidSchedule`, `InvalidAllocation`, `UnknownLock(lockId)`, `NotCancelable(lockId)`, `NotTransferable(lockId)`, `CancelNotRequested(lockId)`, `NoticePending(lockId)`, `Unauthorized`, `NothingToClaim(lockId)`, `InvalidConfiguration`.

## ClaireRevenueLock

Locks that release in tranches as the token's own fee router collects revenue, with a mandatory deadline. Only tokens the registry records as Claire-launched can be locked. There is no fee, owner, cancel path or beneficiary transfer.

**Immutable:** `registry`, the router factory.

Functions:

| Function | Purpose |
| --- | --- |
| `createLocks(token, tranches, deadline, allocations)` | Reads the token's router from the registry, its `quote()` and its `totalRevenue(quote)` as the lock's **baseline**, then creates one lock per allocation (1 to 100) and pulls the exact total once. `tranches` are `(revenue, bps)`: 1 to 10, strictly increasing `revenue` in raw units of the quote asset, each `bps > 0`, summing to 10,000. `deadline` must be in the future. |
| `claim(lockId)` | Anyone. Pays everything unlocked and unclaimed to the beneficiary. |
| `getLock`, `getTranches`, `lockCount`, `earnedRevenue`, `unlockedAmount`, `claimableAmount`, `locked(token)` | Reads. |

Unlocked amount at time `t`: `amount` once `t >= deadline`; otherwise `amount * B / 10000`, where `B` is the sum of `bps` of every tranche with `totalRevenue(quote) - baseline >= revenue`, rounded down. `earnedRevenue` is `totalRevenue(quote) - baseline`.

Revenue is the router's `totalRevenue`: everything it collects from the launchpad's fee escrow, including deliberate third-party credits to its escrow balance, which cannot be told apart from trading revenue on-chain. Fee-on-transfer and rebasing tokens are rejected at funding.

**Events:** `RevenueLockCreated(lockId, token, beneficiary, funder, router, asset, amount, baseline, deadline, tranches)`, `Claimed(lockId, beneficiary, caller, amount)`.

**Errors:** `InvalidConfiguration`, `InvalidTranches`, `InvalidDeadline`, `InvalidAllocation`, `NotClaireLaunched(token)`, `UnknownLock(lockId)`, `NothingToClaim(lockId)`.

## ClairePriceLock

Locks that release in tranches as the token's market price holds, with a mandatory deadline. Only tokens the registry records as Claire-launched can be locked. There is no fee, owner, cancel path or beneficiary transfer. It is a **sampled-price trigger, not an oracle**: anyone can update the price, and an hour with no honest update can carry a manipulated sample.

**Immutables:** `registry`, `ponsFactory`, `ponsPoolManager`, `stockereumPoolManager`; constants `BPS`, `BUCKET` (1 hour), `BUCKETS` (24), `WINDOW` (24 hours) and `MIN_SAMPLES` (24).

Functions:

| Function | Purpose |
| --- | --- |
| `createLocks(token, tranches, deadline, allocations)` | Creates one lock per allocation (1 to 100) and pulls the exact total once. `tranches` are `(price, bps)`: 1 to 10, strictly increasing `price` in raw units of the quote asset per `1e18` token units, each `bps > 0`, summing to 10,000. The first tranche price must be above the token's current `highWater`, and `deadline` must be in the future. |
| `poke(token)` | Anyone, at any time. Samples the launchpad's price and lowers the current hour's recorded minimum if the price is lower. |
| `claim(lockId)` | Anyone. Pays everything unlocked and unclaimed to the beneficiary. |
| `getLock`, `getTranches`, `lockCount`, `unlockedAmount`, `claimableAmount`, `locked(token)`, `windowMin(token)`, `lastSample(token)`, `highWater(token)` | Reads. |

Price source: pons phase 0 (bonding curve) is `quoteReserve * 1e18 / tokenReserve` from the curve's reserves; phase 1 holds the last sample; phase 2 (graduated) is the `slot0` price of the Uniswap v4 pool the pons hook registered for the token; phase 3 (rescued) has no price (`NoPrice`). Stockereum v3 reads the `slot0` of the market's pool.

The ring holds 25 hourly slots: the 24 completed hours and the current one, which never counts. `windowMin` is the minimum over the last 24 consecutive completed hours that each hold a sample; if any hour is empty the window is not full. At each poke that minimum is recorded into `highWater`, a running maximum. A tranche is unlocked once `highWater >= price`, for good. At or after `deadline` everything is unlocked. The unlocked amount is `amount * B / 10000`, where `B` is the sum of `bps` of the unlocked tranches, rounded down.

**Events:** `PriceLockCreated(lockId, token, beneficiary, funder, amount, deadline, tranches)`, `Sampled(token, price, windowMin, windowFull, highWater)`, `Claimed(lockId, beneficiary, caller, amount)`.

**Errors:** `InvalidConfiguration`, `InvalidTranches`, `InvalidDeadline`, `InvalidAllocation`, `TrancheReached(token, highWater)`, `NoPrice(token)`, `NotClaireLaunched(token)`, `UnknownLock(lockId)`, `NothingToClaim(lockId)`.

## ClaireVestingVault

A payee that vests what it receives to one beneficiary. It accepts any ERC-20 and native ETH, has no owner, admin, upgrade, cancel or transfer, and pays only its immutable beneficiary.

**Immutables:** `beneficiary`, `start`, `cliff`, `end`.

Per asset (`address(0)` is ETH): `totalReceived = balance + released`, and

```text
vested = totalReceived * clamp((t - start) / (end - start))     nothing before cliff, everything from end
```

Late deposits vest from `start`. `release(asset)` is permissionless and pays the beneficiary `vested - released`. Reads: `vested(asset)`, `released(asset)`, `releasable(asset)`, `totalReceived(asset)`.

**Events:** `Released(asset, beneficiary, amount)`. **Errors:** `InvalidSchedule`, `NothingToRelease(asset)`, `TransferFailed(asset, to, amount)`.

## ClaireSplit

A payee that divides what it receives between 2 to 10 immutable payees by immutable basis points (each non-zero, summing to 10,000). It accepts any ERC-20 and native ETH.

**Immutables:** `payees`, `shares`.

`release(asset)` is permissionless: each payee is paid `floor(totalReceived * bps / 10000)` minus what it was already paid, and rounding dust stays and joins the next release. A payee that rejects its payout is skipped, keeps its share in the contract and does not block the others. Reads: `paid(asset, index)`, `releasable(asset, index)`, `totalPaid(asset)`, `totalReceived(asset)`.

**Events:** `Released(asset, payee, amount)`. **Errors:** `InvalidSplit`, `NothingToRelease(asset)`.

## ClaireVaultFactory

Deploys vaults and splits with CREATE2 and records them, so an app can verify that a router's `payee()` is a genuine vault or split.

| Function | Purpose |
| --- | --- |
| `deployVault(beneficiary, start, cliff, end, salt)`, `predictVault(beneficiary, start, cliff, end, salt)` | Deploys, or predicts, a vesting vault. Deploying the same arguments again returns the existing vault. |
| `deploySplit(payees, bps, salt)`, `predictSplit(payees, bps, salt)` | Deploys, or predicts, a split. |
| `isVault(address)`, `isSplit(address)` | Whether the factory deployed it. |

**Events:** `VaultDeployed(vault, beneficiary, start, cliff, end, salt)`, `SplitDeployed(split, payees, bps, salt)`.

## ClaireProofView

Stateless. `proof(token)` returns, in one call: `claireLaunched` (true for launched and for migrated tokens), `router`, `launchpad`, `creator`, `payee`, `holderBps`, `buyback` (the launchpad's flag), `quote`, `revenueQuote` and `revenueToken` (the router's `totalRevenue` of the quote asset and of the launch token), `lockedInTokenLock`, `lockedInRevenueLock`, `lockedInPriceLock`, and `ponsLockedSupply` (the launch tokens pons' locker holds for good, `0` elsewhere). For a token Claire did not launch only the three lock amounts are filled.

**Immutables:** `registry`, `tokenLock`, `revenueLock`, `priceLock`, `ponsLocker`.

## Roles and trust

- **Router creator (launcher):** the only account that can launch or adopt through its router, switch its buyback, raise its holder share or propose a payee change. It can only raise the holder share, never lower it; a payee change takes 7 days after a public proposal and can be canceled until applied. It cannot lower Claire's 10%, move the launchpad's fee recipient or take the router out of Claire, and keeps no claim on revenue once a different payee is set.
- **Payee:** an account, or a vault or split that only ever pays its immutable beneficiary or payees. Anyone can trigger a release, and anyone can apply a payee change once its 7 days have passed.
- **Distributor publisher:** a project's designated wallet (or the party fixed when a $CLAIRE or referral distributor is deployed). It is trusted for the off-chain allocation of a round and for nothing else; on an airdrop distributor it can also reclaim what is left after `reclaimAfter`.
- **Launchpad powers:** pons v2 keeps controls of its own that the Claire contracts cannot remove. These include a 2-of-3 Safe admin, a creator-fee recipient change that can be proposed with a public 3-day timelock, a fee-sweep operator, and the power to disable a launch's buyback. They apply unchanged to a token migrated with `adopt`, which no Claire contract can undo or move back. Review the launchpad's current powers before launching or migrating through it.
