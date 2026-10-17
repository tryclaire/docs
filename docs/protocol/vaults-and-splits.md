---
title: Vaults and splits
description: Payees that vest to one beneficiary or divide what they receive, and the factory that records them.
icon: users
order: 58
---

# Vaults and splits

## ClaireVestingVault

A payee that vests what it receives to one beneficiary. It accepts any ERC-20 and native ETH, has no owner, admin, upgrade, cancel or transfer, and pays only its immutable beneficiary.

**Immutables:** `beneficiary`, `start`, `cliff`, `end`.

Per asset (`address(0)` is ETH): `totalReceived = balance + released`, and

```text
vested = totalReceived * clamp((t - start) / (end - start))     nothing before cliff, everything from end
```

Late deposits vest from `start`. `release(asset)` is permissionless and pays the beneficiary `vested - released`. Reads: `vested(asset)`, `released(asset)`, `releasable(asset)`, `totalReceived(asset)`.

**Events:** `Released(asset, beneficiary, amount)`. **Errors:** `InvalidSchedule`, `NothingToRelease(asset)`, `TransferFailed(asset, to, amount)`.

## ClaireSplit

A payee that divides what it receives between 2 to 10 immutable payees by immutable basis points (each non-zero, summing to 10,000). It accepts any ERC-20 and native ETH.

**Immutables:** `payees`, `shares`.

`release(asset)` is permissionless: each payee is paid `floor(totalReceived * bps / 10000)` minus what it was already paid, and rounding dust stays and joins the next release. A payee that rejects its payout is skipped, keeps its share in the contract and does not block the others. Reads: `paid(asset, index)`, `releasable(asset, index)`, `totalPaid(asset)`, `totalReceived(asset)`.

**Events:** `Released(asset, payee, amount)`. **Errors:** `InvalidSplit`, `NothingToRelease(asset)`.

## ClaireVaultFactory

Deploys vaults and splits with CREATE2 and records them, so an app can verify that a router's `payee()` is a genuine vault or split.

| Function | Purpose |
| --- | --- |
| `deployVault(beneficiary, start, cliff, end, salt)`, `predictVault(beneficiary, start, cliff, end, salt)` | Deploys, or predicts, a vesting vault. Deploying the same arguments again returns the existing vault. |
| `deploySplit(payees, bps, salt)`, `predictSplit(payees, bps, salt)` | Deploys, or predicts, a split. |
| `isVault(address)`, `isSplit(address)` | Whether the factory deployed it. |

**Events:** `VaultDeployed(vault, beneficiary, start, cliff, end, salt)`, `SplitDeployed(split, payees, bps, salt)`.
