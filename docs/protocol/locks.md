---
title: Locks
description: The token lock, revenue lock and price lock contracts.
icon: lock
order: 57
---

# Locks

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
