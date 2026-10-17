---
title: Verification
description: Check a launch, payee, lock or distribution round yourself, with the SDK or with plain contract reads.
icon: check
tab: Developers
order: 61
---

# Verification

Everything Claire's protocol does is on a public chain, so you can check a launch, its payee, a time lock, a revenue lock, a price lock, a router's revenue split and a distribution round yourself, without trusting Claire's API or pages. This guide uses the SDK's `@tryclaire/sdk/protocol` subpath first, then shows how to do each check without the SDK.

> [!IMPORTANT]
> Contract addresses are published per chain in the `deployments` map of `@tryclaire/sdk/protocol` and on this site. Take addresses from there, never from a page or message that only claims to be Claire. The contracts are described in the [protocol contract reference](../protocol/index.md).

## What you need

- An RPC endpoint for the chain involved, Robinhood Chain. Balance checks at a past block need an archive-capable endpoint.
- The addresses of the deployment you are checking: the router factory, token lock, revenue lock, price lock, vault factory and proof view, plus the token, router or distributor you are checking. The deployment block is a safe lower bound for event scans.
- For the SDK: Node.js 22 or newer and `@tryclaire/sdk` 0.7.0 or later, with [`viem`](https://viem.sh), an optional peer dependency that only the protocol subpath needs. The root API client stays dependency-free. Version 0.7.0 adds migrated tokens (`adopt`) to `verifyLaunch` and `verifyRouterSplit`.

```sh
npm install @tryclaire/sdk viem
```

## Verify with the SDK

Every function takes explicit addresses and a viem `PublicClient`, pins one block so all fields describe the same state, and returns `{ ok, checks: [{ id, ok, detail }], facts }`. A read that fails, such as an address that is not the expected contract, is reported as a failed check instead of a crash. Event scans run from `fromBlock` (default `0n`; set it to the deployment block) in `chunk`-sized requests (default `10_000n`).

```js
import { createPublicClient, http, zeroAddress } from "viem";
import {
  readProof, verifyLaunch, verifyLock, verifyPriceLock, verifyRevenueLock,
  verifyRouterSplit, verifyRound, verifySplit, verifyVestingVault,
} from "@tryclaire/sdk/protocol";

const client = createPublicClient({ transport: http(process.env.RPC_URL) });
// The addresses of the published deployment for this chain.
const { routerFactory, routerDeployer, tokenLock, revenueLock, priceLock, vaultFactory, proofView } = addresses;
const fromBlock = 1234n; // the deployment block
```

:::cards{cols=3}
::card[Launch and router]{href=launch-and-router.md icon=rocket}
Check a launch and its router split.
::card[Payee]{href=payee.md icon=wallet}
Check a vesting vault or split.
::card[Locks]{href=locks.md icon=lock}
Check a time lock.
::card[Revenue and price locks]{href=revenue-and-price-locks.md icon=chart}
Recompute a lock from router revenue or sampled prices.
::card[Token proof]{href=token-proof.md icon=shield}
Read a token's proof in one call.
::card[Rounds and manifest]{href=rounds-and-manifest.md icon=flow}
Check a distribution round and its manifest.
:::

## Verify without the SDK

You need only an RPC endpoint and a tool that can read contracts and compute keccak-256. The examples use [Foundry's `cast`](https://book.getfoundry.sh/cast/); anything else works the same way. The contract functions and events are in the [protocol contract reference](../protocol/index.md), and the ABIs are exported by `@tryclaire/sdk/protocol`.
