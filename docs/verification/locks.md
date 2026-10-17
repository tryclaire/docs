---
title: Locks
description: Recompute a time lock's vested amount from its schedule and compare it with its events.
icon: lock
order: 64
---

# Locks

## Verify a lock

```js
const lock = await verifyLock(client, { tokenLock, lockId: 0n, routerFactory, fromBlock });
```

Recomputes the schedule and vested amount at the pinned block, ties the lock to its `LockCreated` event and checks the contract holds the tokens it owes. `facts.cancelState` reports the notice-period state (`not-cancelable`, `cancelable`, `notice-not-requested`, `notice-pending`, `cancel-open` or `canceled`), and `cancelNotice`, `cancelAt` and `canceled` must match the lock's `CancelRequested` and `Canceled` events. With `routerFactory`, a lock funded by the token's own router with a matching `OpeningBuyLocked` event is flagged `facts.openingBuy`, and a locked opening buy must not be cancelable.

## Without the SDK

These checks use only an RPC endpoint and the contract functions; see [Verify without the SDK](index.md#verify-without-the-sdk) for the setup.

Read the lock and recompute the vested amount from its schedule, then compare it with `LockCreated` and require the contract's token balance to cover `locked(token)`.

```sh
cast call "$TOKEN_LOCK" "getLock(uint256)((address,address,address,uint128,uint128,uint40,uint40,uint40,bool,bool,bool,uint32,uint40))" 0 --rpc-url "$RPC_URL"
cast call "$TOKEN_LOCK" "claimableAmount(uint256)(uint128)" 0 --rpc-url "$RPC_URL"
```

The fields are `token, funder, beneficiary, amount, claimed, start, cliff, end, cancelable, transferable, canceled, cancelNotice, cancelAt`. A cancelable lock with a non-zero `cancelNotice` can be canceled only from `cancelAt`, which is set by the funder's `CancelRequested` event; `cancelAt` is `0` until it is requested. For an opening-buy lock, the funder is the token's router, `cancelable` is `false`, and the router logged `OpeningBuyLocked(token, lockId, amount)`.
