---
title: Revenue and price locks
description: Recompute revenue and price lock tranches from the router and the sampled price events.
icon: chart
order: 65
---

# Revenue and price locks

## Verify a revenue lock

```js
const revenue = await verifyRevenueLock(client, { revenueLock, lockId: 0n, fromBlock });
```

Checks that the tranches are valid (1 to 10, increasing thresholds, shares summing to 10,000 basis points), that the registry records the lock's router for the token, that router's quote asset and token match, and recomputes `totalRevenue - baseline` and the unlocked amount from the router itself. It also ties the lock, its baseline and its tranches to `RevenueLockCreated`. Remember what the number measures: [revenue is everything the router collects from the launchpad's escrow, including third-party credits](../sources/token-actions/revenue-and-price-locks.md#revenue-locks).

## Verify a price lock

```js
const price = await verifyPriceLock(client, { priceLock, lockId: 0n, routerFactory, fromBlock: 0n });
```

Checks that the token is Claire-launched and that the tranches are valid, then recomputes from the `Sampled` events the hourly minimum samples, the window minimum (24 completed hours, each with a sample), the `highWater` ratchet and the unlocked amount, and compares them with the contract. `highWater` is only proven by a scan from block `0` (or from the price lock's deployment block); from a later block it is not independently confirmed. Remember what the number measures: [a price lock is a sampled-price trigger, not an oracle](../sources/token-actions/revenue-and-price-locks.md#price-target-locks).

## Without the SDK

These checks use only an RPC endpoint and the contract functions; see [Verify without the SDK](index.md#verify-without-the-sdk) for the setup.

### Revenue lock

Read the lock and its tranches, read the router's `totalRevenue(asset)` yourself, and recompute `earned = totalRevenue - baseline` and the unlocked amount.

```sh
cast call "$REVENUE_LOCK" "getLock(uint256)((address,address,address,address,address,uint128,uint128,uint256,uint40,uint256))" 0 --rpc-url "$RPC_URL"
cast call "$REVENUE_LOCK" "getTranches(uint256)((uint128,uint16)[])" 0 --rpc-url "$RPC_URL"
cast call "$ROUTER" "totalRevenue(address)(uint256)" "$ASSET" --rpc-url "$RPC_URL"
```

The lock fields are `token, funder, beneficiary, router, asset, amount, claimed, baseline, deadline, trancheSet`. Require that `launchRouterOf(token)` on the registry (the lock's `registry()`) is the lock's `router`, and that the router's `quote()` is its `asset`.

### Price lock

Read the lock and its tranches, then the token's `highWater`, `windowMin` and `lastSample` from the price lock. Rebuild the window from the `Sampled(token, price, windowMin, windowFull, highWater)` logs: each poke lowers its hour's recorded minimum, and the window minimum is the lowest of the last 24 completed hours that each have a sample. A tranche is unlocked once `highWater >= price`, or everything once `deadline` has passed.

```sh
cast call "$PRICE_LOCK" "getLock(uint256)((address,address,address,uint128,uint128,uint40,uint256))" 0 --rpc-url "$RPC_URL"
cast call "$PRICE_LOCK" "getTranches(uint256)((uint256,uint16)[])" 0 --rpc-url "$RPC_URL"
cast call "$PRICE_LOCK" "highWater(address)(uint256)" "$TOKEN" --rpc-url "$RPC_URL"
cast call "$PRICE_LOCK" "windowMin(address)(uint256,bool)" "$TOKEN" --rpc-url "$RPC_URL"
```

The lock fields are `token, funder, beneficiary, amount, claimed, deadline, trancheSet`. `highWater` is a running maximum, so only a scan of every `Sampled` log from the price lock's deployment proves it.
