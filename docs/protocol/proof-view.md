---
title: Proof view
description: The stateless contract that returns a token's verifiable Claire facts in one call.
icon: shield
order: 59
---

# Proof view

## ClaireProofView

Stateless. `proof(token)` returns, in one call: `claireLaunched` (true for launched and for migrated tokens), `router`, `launchpad`, `creator`, `payee`, `holderBps`, `buyback` (the launchpad's flag), `quote`, `revenueQuote` and `revenueToken` (the router's `totalRevenue` of the quote asset and of the launch token), `lockedInTokenLock`, `lockedInRevenueLock`, `lockedInPriceLock`, and `ponsLockedSupply` (the launch tokens pons' locker holds for good, `0` elsewhere). For a token Claire did not launch only the three lock amounts are filled.

**Immutables:** `registry`, `tokenLock`, `revenueLock`, `priceLock`, `ponsLocker`.
