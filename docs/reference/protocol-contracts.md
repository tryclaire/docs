---
title: Protocol contract reference
order: 16
---

# Protocol contract reference

The Claire protocol is five Solidity contracts. None has an owner, admin, pause, upgrade path or arbitrary call, and every parameter is immutable. The source, tests and ABIs are in the public [protocol repository](https://github.com/tryclaire/protocol). Contract names below are the Solidity names.

> [!IMPORTANT]
> The contracts are not deployed to any public network yet. Addresses are published per chain in the protocol repository's [`deployments/`](https://github.com/tryclaire/protocol/tree/main/deployments) folder, as one `<chainId>.json` manifest per chain, only after a real deployment. Until a manifest exists for a chain, there is nothing to call there. Never use an address from any other source.

Supported launchpads: pons v2 on Robinhood Chain (chain ID `4663`, USDG fees) and Stockereum v3 on Ethereum (chain ID `1`, USDC fees). See [Token actions](../sources/token-actions.md#claire-protocol-fees) for the product behavior and [Verify on-chain](verify-on-chain.md) to check any of it yourself.

## ABIs

The ABIs of all five contracts are committed in the protocol repository's [`abi/`](https://github.com/tryclaire/protocol/tree/main/abi) folder (`ClaireFeeRouter.json`, `ClaireRouterFactory.json`, `ClaireDistributor.json`, `ClaireTokenLock.json`, `ClaireRevenueLock.json`), with a `manifest.json` of source and ABI hashes that CI checks for drift. The same ABIs ship typed in [`@tryclaire/sdk/protocol`](verify-on-chain.md).

## How they fit together

| Contract | Created | Purpose |
| --- | --- | --- |
| `ClaireRouterFactory` | Once per chain | Deploys each launch's fee router (and holder distributor) at a predictable address, and is the registry of Claire-launched tokens. |
| `ClaireFeeRouter` | Once per launch | The launch's only launcher and creator-fee recipient. Splits the trading revenue it collects. |
| `ClaireDistributor` | Per recipient group | Pays a group (project holders, $CLAIRE holders, an airdrop, referrers) through funded Merkle rounds. |
| `ClaireTokenLock` | Once per chain | Timelock, linear and catch-up-cliff token locks. |
| `ClaireRevenueLock` | Once per chain | Locks of Claire-launched tokens that unlock as revenue grows. |

Fees are fixed amounts of one 6-decimal USD stablecoin per chain (`launchFee` 10 and `lockFee` 25, in whole units) plus a share of trading revenue. The stablecoin is assumed to hold its peg; there is no oracle.

## Fee rules

Trading revenue `R` is everything a router claims from the launchpad's fee escrow, per asset, in that asset. `ClaireFeeRouter.split(R)` with `CLAIRE_SHARE_BPS = 1000`, `BPS = 10000` and the router's immutable `holderBps` (0 to 9000):

```text
claire        = R * 1000 / 10000
projectHolder = R * holderBps / 10000
claireHolders = claire / 2
treasury      = claire - claireHolders
creator       = R - claire - projectHolder      (all rounding dust)
```

Claire's 10% is deducted only from the creator's share. Anything that does not arrive through the escrow claim (direct transfers, launch change, refunds) goes to the creator in full and is never charged. A permissionless credit to the router's pons escrow balance cannot be told apart from revenue and is treated as revenue.

| Action | Fee |
| --- | --- |
| Launch through Claire | USD 10 stablecoin, half treasury and half $CLAIRE holders, only if the launch succeeds. |
| Lock of a token launched elsewhere | USD 25 per `createLocks` call, however many beneficiaries. |
| Lock of a token launched through Claire, including the opening-buy lock | None. |
| Revenue lock | None. |
| Claim, cancel, beneficiary transfer, airdrop and referral claims | Gas only. |

## ClaireRouterFactory

Deploys per launch a `ClaireFeeRouter` and, when `holderBps` is non-zero, the project's `ClaireDistributor`, both at CREATE2 addresses that `predict` returns before the launch. It is also the registry of Claire-launched tokens: only routers it deployed can register, once per token. It holds no funds.

**Immutables:** `claireHolderDistributor`, `treasury`, `ponsFactory`, `ponsEscrow`, `ponsLaunchRouter`, `stockereumFactory`, `stockereumEscrow`, `feeToken`, `launchFee`, `tokenLock`.

Functions:

| Function | Purpose |
| --- | --- |
| `deploy(launchpad, creator, publisher, holderBps, salt)` | Deploys the router (and holder distributor); read it with `router.projectHolderDistributor()`. `publisher` is who may publish project-holder rounds. |
| `predict(launchpad, creator, publisher, holderBps, salt)` | The router and distributor addresses `deploy` would produce. |
| `registerLaunch(token)` | Called by a router after its launch. Only a router this factory deployed may call it. |
| `launchRouterOf(token)`, `isClaireLaunched(token)`, `isRouter(router)` | The registry reads. |
| `deployAirdrop(token, salt)` | Deploys an airdrop distributor for a Claire-launched token. Only that launch's creator may call it and becomes its publisher. |
| `predictAirdrop(token, creator, salt)`, `airdropTokenOf(distributor)` | The address `deployAirdrop` would produce, and the token an airdrop distributor belongs to. |

**Events:** `RouterDeployed(router, creator, projectHolderDistributor, launchpad, holderBps, salt)`, `ClaireLaunchRegistered(token, router)`, `AirdropDeployed(token, distributor, creator, salt)`.

**Errors:** `InvalidConfiguration`, `UnsupportedLaunchpad`, `NotRouter`, `AlreadyRegistered(token)`, `NotLaunchCreator`.

## ClaireFeeRouter

One launch's creator-fee recipient and its only launcher. It carries out the launchpad launch, pays the launch fee, registers the token and splits all trading revenue it claims from the launchpad's escrow.

**Immutables:** `launchpad` (`PonsV2` or `StockereumV3`), `launchFactory`, `launchRouter` (pons only), `escrow`, `registry`, `creator`, `projectHolderDistributor`, `claireHolderDistributor`, `treasury`, `feeToken`, `tokenLock`, `launchFee`, `holderBps`; constants `BPS`, `CLAIRE_SHARE_BPS`, `MAX_HOLDER_BPS`.

**State:** `launchedToken`, `curve`, `ponsQuote`, `stockereumQuote`, `revenuePending(asset)`, `owed(payee, asset)`, `totalOwed(asset)` and `totalRevenue(asset)`, the cumulative revenue charged per asset. It never decreases and is what revenue locks read.

Functions:

| Function | Purpose |
| --- | --- |
| `launchPons(params, launchConfigId, pairToken, quoteIn, minTokensOut, exemptions, lock)` | Creator only, once. Launches on pons v2 with the router as creator-fee recipient and buybacks off. |
| `launchStockereum(params, minOut, withBuy, lock)` | Creator only, once. Launches on Stockereum v3, never with holder-reward routing. |
| `harvest(asset)` | Anyone. Sweeps what the launchpad allows, claims the router's escrow balance of the quote asset and distributes. |
| `distribute(asset)` | Anyone. Distributes funds already held, charging only revenue already claimed from the escrow. |
| `withdraw(asset)`, `withdrawTo(asset, to)` | A payee collects a payout a previous push could not deliver. |
| `split(revenue)` | The four-way split above, as a view. |
| `quote()` | The launch's quote asset (`address(0)` is native ETH). Reverts `NotBound` before the launch. |

`lock` is `OpeningLock(start, cliff, end, transferable)`. With `end == 0` the launch is a normal launch. With `end != 0` an opening buy is required, and every bought token is locked for the creator in `ClaireTokenLock`, never cancelable (see [Lock the opening buy](../sources/token-actions.md#lock-the-opening-buy)).

**Events:** `Launched(token, quote)`, `StockereumLaunched(token, poolId, tokensToCreator)`, `LaunchFeePaid(payer, feeToken, amount, treasuryAmount, claireHolderAmount)`, `OpeningBuyLocked(token, lockId, amount)`, `RevenueCollected(asset, amount)`, `Distributed(asset, received, revenue, creatorAmount, projectHolderAmount, claireHolderAmount, treasuryAmount)`, `PayoutDeferred(payee, asset, amount)`, `Withdrawn(payee, asset, amount)`.

**Errors:** `InvalidConfiguration`, `Unauthorized`, `AlreadyBound`, `NotBound`, `OpeningBuyRequired`, `WrongLaunch`, `WrongAsset(asset)`, `HolderRoutingNotAllowed`, `NothingToDistribute(asset)`.

## ClaireDistributor

Holds one recipient group's entitlement and pays it in funded rounds. The publisher posts the Merkle root of `(account, amount)` leaves computed off-chain. Each round reserves exactly its total from unreserved funds, so a root can never promise more than the contract holds. There is no withdrawal, sweep, owner or upgrade path: funds leave only through claims.

**Immutables:** `publisher` and `group`, a label of the recipient group.

Functions:

| Function | Purpose |
| --- | --- |
| `publishRound(expectedRoundId, asset, total, root, snapshotBlock, evidence)` | Publisher only. Reserves `total` of funds already held. `expectedRoundId` must equal `roundCount()`. |
| `fundAndPublishRound(...)` | Same arguments. Pulls exactly `total` of an ERC-20 from the publisher first. |
| `claim(roundId, index, account, amount, proof)` | Anyone. Pays `account` its leaf amount, once per leaf. |
| `leaf(roundId, index, account, amount)` | The leaf hash, `keccak256(keccak256(abi.encode(chainid, distributor, roundId, index, account, amount)))`. |
| `getRound(roundId)`, `roundCount()`, `isClaimed(roundId, index)`, `unreserved(asset)`, `reserved(asset)` | Reads. A round is `(asset, total, claimed, root, snapshotBlock, evidence)`. |

The publisher can misallocate a round it publishes, but cannot withdraw, exceed funded balances, alter or replace a published round, or touch reserved funds. `snapshotBlock` is recorded, not checked. `evidence` is a commitment to the round's manifest, which you can check with [Verify on-chain](verify-on-chain.md#verify-a-distribution-round).

**Events:** `RoundPublished(roundId, asset, total, root, snapshotBlock, evidence)`, `Claimed(roundId, index, account, amount, caller)`.

**Errors:** `Unauthorized`, `InvalidRound`, `InsufficientUnreserved(asset, available, requested)`, `AlreadyClaimed(roundId, index)`, `InvalidProof`, `RoundExhausted(roundId)`.

## ClaireTokenLock

Token allocation locks: an end-date timelock, linear vesting, or linear vesting with a cliff whose catch-up amount unlocks at the cliff. One contract holds many locks. These are token allocation locks, not liquidity-pool locks.

**Immutables:** `registry`, `feeToken`, `lockFee`, `treasury`, `claireHolderDistributor`.

Functions:

| Function | Purpose |
| --- | --- |
| `createLocks(token, schedule, allocations)` | Creates one lock per allocation (1 to 100) and pulls the exact total once. `schedule` is `(start, cliff, end, cancelable, transferable)`. Timelock: `cliff == end`. Linear: `cliff == start`. Charges the lock fee once per call unless the registry records the token as Claire-launched. |
| `claim(lockId)` | Anyone. Pays what is claimable to the beneficiary. |
| `cancel(lockId)` | Funder only, only if created cancelable. Vested tokens stay claimable; the unvested remainder returns to the funder. |
| `transferBeneficiary(lockId, to)` | Beneficiary only, only if created transferable. |
| `getLock`, `lockCount`, `vestedAmount(lockId, timestamp)`, `claimableAmount`, `locked(token)` | Reads. |

Vested amount: all of `amount` from `end` (or once canceled); `0` before `cliff` or `start`; otherwise `amount * (t - start) / (end - start)`, rounded down. Fee-on-transfer and rebasing tokens are rejected at funding.

**Events:** `LockCreated(lockId, token, beneficiary, funder, amount, start, cliff, end, cancelable, transferable)`, `Claimed(lockId, beneficiary, caller, amount)`, `Canceled(lockId, funder, refunded, stillClaimable)`, `BeneficiaryTransferred(lockId, from, to)`, `LockFeePaid(funder, token, amount)`.

**Errors:** `InvalidSchedule`, `InvalidAllocation`, `UnknownLock(lockId)`, `NotCancelable(lockId)`, `NotTransferable(lockId)`, `Unauthorized`, `NothingToClaim(lockId)`, `InvalidConfiguration`.

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

## Roles and trust

- **Router creator:** the only account that can launch through its router. It cannot change the split or redirect the launchpad's fee recipient.
- **Distributor publisher:** a project's designated wallet (or the party fixed when a $CLAIRE or referral distributor is deployed). It is trusted for the off-chain allocation of a round and for nothing else.
- **Launchpad powers:** pons v2 and Stockereum v3 keep controls of their own that the Claire contracts cannot remove. Review the launchpad's current powers before launching through it.
