---
title: Token proof
description: Read a token's Claire facts from the proof view contract in one call.
icon: shield
order: 66
---

# Token proof

## Read a token's proof

```js
const proof = await readProof(client, { proofView, token });
```

One `ClaireProofView` call: whether the token is Claire-launched (launched or migrated), its router, launchpad, creator, payee, holder share and buyback flag (the holder share and payee are the current values), a payee change the creator has announced (`pendingPayee` and `payeeChangeAt`, the zero address and `0` when none), the router's revenue per quote and launch token, the amounts locked in the token lock, revenue lock and price lock, and on pons the supply the launchpad's locker holds permanently. It reads one pinned block and is a convenient summary, not a replacement for the [other verifiers](index.md#verify-with-the-sdk).
