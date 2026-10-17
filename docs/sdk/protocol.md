---
title: Protocol subpath
description: Use @tryclaire/sdk/protocol for the contract ABIs, the deployments map and the on-chain verifiers.
icon: link
order: 50
---

# Protocol subpath

The `@tryclaire/sdk/protocol` subpath [verifies launches, locks, payees and rounds on-chain](../verification/index.md); it needs the optional `viem` peer dependency, and the root client stays dependency-free.

```sh
npm install @tryclaire/sdk viem
```

## ABIs and deployments

The ABIs of all twelve contracts ship typed in [`@tryclaire/sdk/protocol`](../verification/index.md) (`claireFeeRouterAbi`, `claireRouterFactoryAbi`, `claireRouterDeployerAbi`, `claireDistributorAbi`, `claireDistributorFactoryAbi`, `claireTokenLockAbi`, `claireRevenueLockAbi`, `clairePriceLockAbi`, `claireVestingVaultAbi`, `claireSplitAbi`, `claireVaultFactoryAbi` and `claireProofViewAbi`), exported as `as const` values you can pass straight to viem. Install version 0.7.0 or later.

> [!IMPORTANT]
> Addresses are published per chain in the `deployments` map of [`@tryclaire/sdk/protocol`](../verification/index.md) and on this site. Never use an address from any other source.

## Next steps

:::cards
::card[Verification]{href=../verification/index.md icon=check}
Check a launch, lock or round yourself.
::card[Protocol contracts]{href=../protocol/index.md icon=file}
What each contract does.
:::
