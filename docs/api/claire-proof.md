---
title: Claire Proof endpoint
description: Read the linked token's Claire Proof, the on-chain facts its public proof page shows, from the chain at one block.
icon: shield
order: 46
---

# Claire Proof endpoint

## Read the Claire Proof

`GET /api/v1/token/proof` (MCP tool `get_token_proof`, scope `token:read`) returns the [Claire Proof](../sources/token-actions/claire-proof.md) for the organization's linked token, the facts its public proof page shows plus the detail behind them, with `data` set to `null` when no token is linked. Unlike the other token reads it makes RPC requests: the on-chain figures come from one read at one block, stated in `block`, and are cached briefly. It returns:

- `chainId`, `network`, `explorer`, `url` (the token's permalink `/proof/<chainId>/<token>`, the token's public proof page; append `/badge.svg` for the badge), `token` (`address`, `name`, `symbol`, `decimals`, `totalSupply`) and `block` (`number`, `time`).
- `claire`: whether the token's launch is registered by a Claire router factory (launched or migrated), and `launch` when it is (`router`, `launchpad`, `creator`, `payee`, `payeeKind` of `creator`, `vault`, `split` or `other`, `holderBps`, `buyback`, `pendingPayee` and `migrated`). `payee` and `holderBps` are the current values. `launch.pendingPayee` is `null` or `{ address, kind, effectiveAt }`, the payee change the creator has announced and the time it can take effect. `launch.migrated` is `null` for a token launched through Claire; for a token brought over with `adopt` it holds `at` (ISO time of the adoption block, or `null` if it could not be read) and `block`. A linked token that never migrated is not registered.
- `locked`: raw amounts held by the time, revenue and price lock contracts for this token (`time`, `revenue`, `price`, `total`), `percent` of total supply (`null` when supply is zero), and the organization's published `locks` with their proof URLs. Vested but unclaimed tokens are included.
- `openingLock` (from the confirmed launch receipt, or `null`), `ponsLocked` (the supply pons' locker holds), `revenue` (the distributor, per asset what the router counted as `routed` and the cumulative total `published` to holders, and the confirmed `rounds` with `evidence` and `manifestUrl`) and `feeRecipient` (the launchpad's creator-fee recipient, `ok` when it is the Claire router, and any `pending` change).
- `contracts` (the lock and proof-view contracts it read) and `links` (the X account and Telegram chat the organization connected inside Claire, which are not on-chain facts). Take verification addresses from `@tryclaire/sdk/protocol`, not from this response.

```sh
curl --header "Authorization: Bearer $CLAIRE_API_KEY" "$CLAIRE_API_URL/token/proof"
```
