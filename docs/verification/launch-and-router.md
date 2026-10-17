---
title: Launch and router
description: Check that a token was launched through Claire and that its router splits revenue as documented.
icon: rocket
order: 62
---

# Launch and router

## Verify a launch

```js
const launch = await verifyLaunch(client, { token, routerFactory, routerDeployer, vaultFactory, fromBlock });
```

Checks that the factory records the token against a router it deployed, that the router's creator, treasury, $CLAIRE holder distributor, fee token, launch fee, migration fee, launchpad addresses and pons buyback vault equal the factory's and its `RouterDeployed` event, that its holder share is within the limit and it has a project holder distributor, and that the token's launch event matches. The router's address must also be the one the factory's `ClaireRouterDeployer` predicts for its starting configuration (`routerDeployer` defaults to the factory's own).

The payee and holder share can differ from the `RouterDeployed` event, but only through the router's own events. The check replays `HolderShareRaised`, `PayeeChangeProposed`, `PayeeChangeCanceled` and `PayeeChanged` from the starting values: a raise only goes up, a payee change needs a proposal made 7 days earlier, and the result must equal the router's current `holderBps`, `payee` and pending proposal. A payee or holder share that differs without an event fails the `split-history` check. `launch.facts.initial` holds the starting values, `launch.facts.holderShareRaises` and `launch.facts.payeeChanges` the history, and `launch.facts.launch.pendingPayee` and `payeeChangeAt` an announced payee change that has not taken effect yet. With `vaultFactory`, `launch.facts.payeeKind` is `creator`, `vault`, `split` or `other`: the payee in effect now; a payee that is a vault or split must have been recorded by `ClaireVaultFactory`. `launch.facts.router` is the router for the next checks.

`launch.facts.path` says how the token came to Claire:

- `"launched"`: Claire launched it. Exactly one `Launched` event from the router matches.
- `"migrated"`: it was brought over with `adopt`. Exactly one `Adopted` event and one `MigrationFeePaid` event match, and the fee equals the router's `migrationFee`. `launch.facts.launchBlock` is the block of the `Launched` or `Adopted` event.

Fees a migrated token earned before `adopt` are not revenue. `verifyRouterSplit` returns them as `facts.historical` (per asset, from `HistoricalFeesPaid`) and does not count them in the summed revenue or in `totalRevenue`.

## Verify a router split

```js
const split = await verifyRouterSplit(client, { router: launch.facts.router, fromBlock });
```

Recomputes the split of every `Distributed` event from its charged revenue at the holder share in effect when it happened, replaying the router's `HolderShareRaised` and `PayeeChanged` events in log order (`facts.holderShareRaises`, `facts.payeeChanges`), and compares it with the router's own `split()` for distributions made under its current share. The creator share goes to the payee in effect then (`facts.payees`, one per distribution). The replay must end at the router's current `holderBps` and `payee`. Revenue in the quote asset and, on pons, in the launch token (buyback vests) is counted, and revenue charged in any other asset fails. Scanning from the router's first block also ties the summed revenue to `totalRevenue(asset)`; from a later block the sum is only a lower bound.

## Without the SDK

These checks use only an RPC endpoint and the contract functions; see [Verify without the SDK](index.md#verify-without-the-sdk) for the setup.

### Launch

Read `launchRouterOf(token)` and `isRouter(router)` on the factory. Read `launchedToken()` and `registry()` on the router and require your token and the factory. Compare the router's `treasury()`, `claireHolderDistributor()`, `feeToken()`, `launchFee()`, `migrationFee()` and `buybackVault()` with the factory's, and look for exactly one `RouterDeployed` log from the factory naming the router's `creator()`; its `payee` and `holderBps` are the starting values. The current `payee()` and `holderBps()` equal them unless the router emitted `HolderShareRaised(oldBps, newBps)` or `PayeeChanged(oldPayee, newPayee)` logs that chain from them (a payee change also needs a `PayeeChangeProposed(next, effectiveAt)` log from at least 7 days before it). Check a pending change with `pendingPayee()` and `payeeChangeAt()`. A launched token has exactly one `Launched` log from the router. A migrated token has exactly one `Adopted` log and one `MigrationFeePaid` log whose `amount` equals `migrationFee()`, and no `Launched` log.

```sh
cast call "$FACTORY" "launchRouterOf(address)(address)" "$TOKEN" --rpc-url "$RPC_URL"
cast call "$FACTORY" "isRouter(address)(bool)" "$ROUTER" --rpc-url "$RPC_URL"
cast call "$ROUTER" "launchedToken()(address)" --rpc-url "$RPC_URL"
cast call "$ROUTER" "payee()(address)" --rpc-url "$RPC_URL"
cast call "$ROUTER" "holderBps()(uint16)" --rpc-url "$RPC_URL"
cast call "$ROUTER" "pendingPayee()(address)" --rpc-url "$RPC_URL"
cast call "$ROUTER" "payeeChangeAt()(uint40)" --rpc-url "$RPC_URL"
```

### Router split

Fetch the router's `Distributed(asset, received, revenue, creatorAmount, projectHolderAmount, claireHolderAmount, treasuryAmount)` logs and recompute each with the [fee rules](../protocol/fee-rules-and-trust.md#fee-rules) using the `holderBps` in effect at that log: the starting value, raised by each earlier `HolderShareRaised` log (ordered by block and log index). `creatorAmount` is the payee's share and also includes `received - revenue`. Summed from the first block, the `revenue` of each asset (the quote asset and, on pons, the launch token) equals `totalRevenue(asset)`. For a migrated token, `HistoricalFeesPaid(asset, amount)` logs are the creator's pre-migration fees: they are not revenue and are not in `totalRevenue`.

```sh
cast logs --address "$ROUTER" --from-block "$DEPLOY_BLOCK" --rpc-url "$RPC_URL" \
  "Distributed(address,uint256,uint256,uint256,uint256,uint256,uint256)"
cast logs --address "$ROUTER" --from-block "$DEPLOY_BLOCK" --rpc-url "$RPC_URL" "HolderShareRaised(uint16,uint16)"
cast logs --address "$ROUTER" --from-block "$DEPLOY_BLOCK" --rpc-url "$RPC_URL" "PayeeChanged(address,address)"
cast call "$ROUTER" "totalRevenue(address)(uint256)" "$ASSET" --rpc-url "$RPC_URL"
```
