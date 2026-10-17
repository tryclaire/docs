---
title: Signing wallet
description: Designate the wallet that signs launches and locks for your workspace.
icon: key
order: 9
---

# Signing wallet

The **signing wallet** is the organization's designated wallet. Owners and admins prepare token actions in Claire; this wallet signs them.

## Designate the wallet

:::steps

### Choose the network and wallet

Open the signing wallet, then select the network and the wallet that will sign. A plain wallet (no contract code on any Claire network) designated with one signature also becomes the wallet on each other network that has none yet; a contract wallet is designated per network.

### The owner signs a challenge

An **organization owner** signs a short-lived verification challenge to prove control. This verifies the designation; it does not transfer funds or give Claire spending authority. Only the owner can designate or remove the wallet.

### Admins prepare, the wallet signs

Owners and admins can prepare launches and locks, but the **designated wallet must sign**. Being an admin does not give someone another person's wallet keys. Members cannot manage launches or vesting allocations.
:::

## What the designation does not change

> [!NOTE]
> Removing the designation or a member does not revoke wallet keys, on-chain rights, or previously executed transactions. Claire records intent and verified chain outcomes, not private keys. It does not custody funds, sponsor gas, or sign transactions on your behalf.

## Next steps

:::cards
::card[Launch a token]{href=launch.md icon=rocket}
Prepare a launch that the designated wallet signs.
::card[Fund a lock]{href=vesting-and-locks.md icon=lock}
Lock tokens for beneficiaries.
:::
