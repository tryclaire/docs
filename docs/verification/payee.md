---
title: Payee
description: Check that a router's payee is a genuine vesting vault or split and recompute what it owes.
icon: wallet
order: 63
---

# Payee

## Verify the payee

```js
const vault = await verifyVestingVault(client, {
  vault: launch.facts.launch.payee, vaultFactory, assets: [launch.facts.launch.quote, zeroAddress], fromBlock,
});
const share = await verifySplit(client, { split: launch.facts.launch.payee, vaultFactory, assets: [launch.facts.launch.quote, zeroAddress], fromBlock });
```

Use the one that matches `payeeKind`. `verifyVestingVault` checks that the vault is genuine (the factory recorded it and its CREATE2 `predictVault` from the `VaultDeployed` event is the vault) and, per asset (`zeroAddress` is ETH), recomputes `vested`, `releasable` and `released`, and ties `released` to the `Released` events. `verifySplit` checks `isSplit` and `predictSplit` from `SplitDeployed`, that the shares are 2 to 10 payees summing to 10,000 basis points, and, per asset, recomputes every payee's paid amount, the releasable remainder and the total paid, tied to the `Released` events.

## Without the SDK

These checks use only an RPC endpoint and the contract functions; see [Verify without the SDK](index.md#verify-without-the-sdk) for the setup.

If `payee()` differs from `creator()`, ask the vault factory whether it recorded it, then read its terms and recompute what is owed.

```sh
cast call "$VAULT_FACTORY" "isVault(address)(bool)" "$PAYEE" --rpc-url "$RPC_URL"
cast call "$VAULT_FACTORY" "isSplit(address)(bool)" "$PAYEE" --rpc-url "$RPC_URL"
cast call "$PAYEE" "vested(address)(uint256)" "$ASSET" --rpc-url "$RPC_URL"     # vault
cast call "$PAYEE" "payees()(address[])" --rpc-url "$RPC_URL"                   # split
cast call "$PAYEE" "shares()(uint16[])" --rpc-url "$RPC_URL"
```

A vault vests `totalReceived * clamp((t - start) / (end - start))` per asset, with nothing before `cliff`; `totalReceived` is its balance plus `released(asset)`. A split pays payee `i` `floor(totalReceived * shares[i] / 10000)` minus `paid(asset, i)`. Both match their `Released` logs.
