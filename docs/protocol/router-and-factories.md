---
title: Router and factories
description: The fee router, the factory that deploys it and the deployer that creates routers.
icon: flow
order: 55
---

# Router and factories

## ClaireRouterFactory

Deploys per launch a `ClaireFeeRouter` (through the `ClaireRouterDeployer`) and the project's `ClaireDistributor` (through the distributor factory), always both, also when the holder share starts at 0 so the creator can raise it later. Both are at CREATE2 addresses that `predict` returns before the launch. It is also the registry of Claire-launched tokens, launched or adopted: only routers it deployed can register, once per token. It holds no funds.

**Immutables:** `claireHolderDistributor`, `treasury`, `ponsFactory`, `ponsEscrow`, `ponsLaunchRouter`, `ponsBuybackVault`, `stockereumFactory`, `stockereumEscrow`, `feeToken`, `launchFee`, `migrationFee`, `tokenLock`, `distributors`, `routers` (the `ClaireRouterDeployer`).

Functions:

| Function | Purpose |
| --- | --- |
| `deploy(launchpad, creator, payee, publisher, holderBps, salt)` | Deploys the router and holder distributor; read it with `router.projectHolderDistributor()`. `creator` is the launcher; `payee` receives the creator share at first (the creator itself when it chooses none; the zero address is refused); `holderBps` is the starting holder share. The creator can change both later, within the limits [below](router-and-factories.md#changing-the-split). `publisher` is who may publish project-holder rounds. Deploying the same arguments again returns the existing router. |
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

The `creator` is the launcher: the only caller of `launchPons`, `launchStockereum`, `adopt` and `setBuyback`, and the recipient of opening-buy tokens and launch change (or the beneficiary of the locked opening buy). The `payee` receives the creator share of every distribution. It is an account, a `ClaireVestingVault` or a `ClaireSplit`, and starts as the deployment's payee; the creator can [change it with 7 days' notice](router-and-factories.md#changing-the-split).

**State:** `payee`, `holderBps`, `pendingPayee` and `payeeChangeAt` (the creator's proposed payee, or the zero address and `0` when none), `launchedToken`, `curve`, `ponsQuote`, `stockereumQuote`, `stockereumPoolId`, `migrationFee`, `historicalVest()`, `revenuePending(asset)`, `owed(payee, asset)`, `totalOwed(asset)` and `totalRevenue(asset)`, the cumulative revenue charged per asset (the quote asset and, on pons, the launch token). It never decreases and is what revenue locks read.

Functions:

| Function | Purpose |
| --- | --- |
| `launchPons(params, launchConfigId, pairToken, quoteIn, minTokensOut, exemptions, lock)` | Creator only, once. Launches on pons v2 with the router as creator-fee recipient. `params` carries the token's name, symbol, logo, description, socials, `creatorFeeRecipient` (must be the router), `creatorTaxBps`, `buybackEnabled`, `expectedEconomics` and `salt`. `launchConfigId` picks the bonding curve, `pairToken` the quote asset, `quoteIn` an optional opening buy, and `exemptions` the wallets exempt from the opening snipe tax. |
| `launchStockereum(params, minOut, withBuy, lock)` | Creator only, once. Launches on Stockereum v3 (Ethereum, coming soon and not available), never with holder-reward routing. |
| `setBuyback(enabled)` | Creator only, after a pons launch. Forwards the flag to the launchpad from the router, the only account it accepts it from. It cannot move fees. |
| `adopt(token)` | Creator only, once, while no token is bound, on a pons router only. Brings a token launched on pons outside Claire: the token's pons creator-fee recipient must already be this router, which the creator moves with pons' own `transferCreatorFeeRecipient`. Sets `launchedToken`, `curve` and `ponsQuote` as `launchPons` does, pulls `migrationFee` from the creator (half treasury, half $CLAIRE holders; `MigrationFeePaid`), registers the token and emits `Adopted(token, quote)`. See [the cutoff](router-and-factories.md#adoption-cutoff). |
| `harvest(asset)` | Anyone. `asset` is the quote or, on pons, the launch token. Sweeps what the launchpad allows, claims the router's escrow balance and distributes. For the launch token it first releases what the buyback vault has vested. |
| `distribute(asset)` | Anyone. Distributes funds already held, charging only revenue already claimed from the escrow. |
| `withdraw(asset)`, `withdrawTo(asset, to)` | A payee collects a payout a previous push could not deliver. |
| `withdrawFor(payee, asset)` | Anyone retries a payee's deferred payout; it always pays that payee itself (how a vault or split recovers one). |
| `split(revenue)` | The four-way split in [Fee rules and trust](fee-rules-and-trust.md#fee-rules), as a view. |
| `quote()` | The launch's quote asset (`address(0)` is native ETH). Reverts `NotBound` before the launch. |

`lock` is `OpeningLock(start, cliff, end, transferable)`. With `end == 0` the launch is a normal launch. With `end != 0` an opening buy is required, and every bought token is locked for the creator in `ClaireTokenLock`, never cancelable (see [Lock the opening buy](../sources/token-actions/launch.md#lock-the-opening-buy)).

**Events:** `Launched(token, quote)`, `Adopted(token, quote)`, `StockereumLaunched(token, poolId, tokensToCreator)`, `LaunchFeePaid(payer, feeToken, amount, treasuryAmount, claireHolderAmount)`, `MigrationFeePaid(payer, feeToken, amount, treasuryAmount, claireHolderAmount)`, `HistoricalFeesPaid(asset, amount)`, `OpeningBuyLocked(token, lockId, amount)`, `BuybackSet(token, enabled)`, `RevenueCollected(asset, amount)`, `Distributed(asset, received, revenue, creatorAmount, projectHolderAmount, claireHolderAmount, treasuryAmount)`, `PayoutDeferred(payee, asset, amount)`, `Withdrawn(payee, asset, amount)`, `HolderShareRaised(oldBps, newBps)`, `PayeeChangeProposed(next, effectiveAt)`, `PayeeChangeCanceled(next)`, `PayeeChanged(oldPayee, newPayee)`. In `Distributed`, `creatorAmount` is the payee's share. `Adopted` replaces `Launched` for a [migrated token](../sources/token-actions/linking-and-migration.md#bring-a-linked-token-to-claire); a router emits one or the other, never both.

**Errors:** `InvalidConfiguration`, `Unauthorized`, `AlreadyBound`, `NotBound`, `OpeningBuyRequired`, `WrongLaunch`, `WrongAsset(asset)`, `HolderRoutingNotAllowed`, `NothingToDistribute(asset)`, `UnsweptFees`, `NoPendingPayee`, `PayeeChangeNotReady`.

### Changing the split

Only the router's `creator` can start a change, and no change can take a router out of Claire: the router never moves the launchpad's creator-fee recipient, Claire's 10% stays, and the holder share can never be lowered. Every router has these functions; there is no per-launch choice.

| Function | Purpose |
| --- | --- |
| `raiseHolderShare(newBps)` | Creator only. Instantly raises `holderBps` to `newBps`, which must be above the current share and at most `MAX_HOLDER_BPS`. Fees earned so far are first harvested and distributed under the old share, so the new share applies only to fees collected after the call. Emits `HolderShareRaised(oldBps, newBps)`. |
| `proposePayee(next)` | Creator only. Announces a new payee (not the zero address, not the current payee) that can take effect after `PAYEE_DELAY` (7 days). Replaces any pending proposal and restarts the delay. Emits `PayeeChangeProposed(next, effectiveAt)`; `pendingPayee` and `payeeChangeAt` show it. |
| `cancelPayee()` | Creator only. Withdraws the pending proposal (`NoPendingPayee` when none). Emits `PayeeChangeCanceled(next)`. |
| `applyPayee()` | Anyone, once `block.timestamp >= payeeChangeAt` (`PayeeChangeNotReady` before). Fees earned so far are first harvested and distributed to the current payee, so the order of `applyPayee` and `harvest` never matters; then the payee changes and the proposal clears. Emits `PayeeChanged(oldPayee, newPayee)`. Payouts the old payee was already owed stay its own: `withdraw`, `withdrawTo` and `withdrawFor` keep working for it. |

The new payee can be an account, a [vault or split](vaults-and-splits.md#clairevestingvault); the router does not check what it is, so [verify](../verification/payee.md#verify-the-payee) it before relying on it.

### Adoption cutoff

Adoption is a clean cutoff. Only revenue the router receives after it is charged and counted in `totalRevenue`; what the token earned before is paid to the creator uncharged.

1. `adopt` first runs the router's sweep as the new recipient (curve fees, or the canonical pool's quote fees after graduation). It then reverts `UnsweptFees` while creator-side fees or a buyback balance remain unswept on the curve or on the canonical pool, in either currency, that only the launchpad's operator can settle.
2. It claims the router's own pons escrow balance of the quote and the launch token, whatever arrived between the recipient move and `adopt`, and pays it to the creator. This is `HistoricalFeesPaid`, not revenue, so it never advances a revenue lock. A refused payout is deferred like any other.
3. It sets aside the creator's share of an existing buyback vest that is still unreleased as `historicalVest()`, `(totalLocked - totalReleased) * (10000 - protocolShareBps) / 10000` from the vest vault. The first `historicalVest()` launch tokens that `harvest(launchToken)` receives go to the creator uncharged (`HistoricalFeesPaid`); only buybacks after that count as revenue. The vault's per-release rounding can shift a few wei between the two.
4. The creator's own pons escrow balance is never touched. The router has no function that moves the recipient back; only the launchpad's administration can.

## ClaireRouterDeployer

Creates routers for the factory. A router lives at the CREATE2 address of this deployer, the factory's key and the router's creation code with its configuration, so `predict(key, config)` and the factory's `predict` agree. Only the registry named in the configuration can call `deploy(key, config)` (`NotRegistry` otherwise), so nobody can occupy a factory router's address. It is stateless and holds no funds. Read its address from `ClaireRouterFactory.routers()`.
