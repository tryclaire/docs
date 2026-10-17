---
title: Deployments and ABIs
description: Where contract addresses and typed ABIs are published, and the supported launchpad.
icon: globe
order: 54
---

# Deployments and ABIs

> [!IMPORTANT]
> Addresses are published per chain in the `deployments` map of [`@tryclaire/sdk/protocol`](../verification/index.md) and on this site. Never use an address from any other source.

Supported launchpad: pons v2 on Robinhood Chain (chain ID `4663`, USDG fees). Stockereum v3 on Ethereum (chain ID `1`, USDC fees) is implemented in the contracts but is coming soon and not available to use. See [Token actions](../sources/token-actions/fees.md) for the product behavior and [Verify on-chain](../verification/index.md) to check any of it yourself.

## ABIs

The ABIs of all twelve contracts ship typed in [`@tryclaire/sdk/protocol`](../verification/index.md) (`claireFeeRouterAbi`, `claireRouterFactoryAbi`, `claireRouterDeployerAbi`, `claireDistributorAbi`, `claireDistributorFactoryAbi`, `claireTokenLockAbi`, `claireRevenueLockAbi`, `clairePriceLockAbi`, `claireVestingVaultAbi`, `claireSplitAbi`, `claireVaultFactoryAbi` and `claireProofViewAbi`), exported as `as const` values you can pass straight to viem. Install version 0.7.0 or later.
