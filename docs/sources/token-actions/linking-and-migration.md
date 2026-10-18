---
title: Link and migrate a token
description: Link an existing pons token to your workspace or bring it fully into Claire.
icon: link
order: 11
---

# Link and migrate a token

Two ways to bring a token you launched elsewhere into Claire: **link** it for workspace tools only, or **migrate** it to get everything a Claire launch has. See [three ways in](index.md#three-ways-in-on-robinhood-chain) for a comparison.

## Link an existing pons token

To link an existing pons token, use **Link your token** on the Token page or **Settings → Connections**, enter its contract address and select Robinhood Chain. Claire verifies the chain, factory, and designated wallet requirements. One workspace has one active linked token; resolve its existing link before starting a different launch.

## Bring a linked token to Claire

Migration brings a pons token you linked into Claire without relaunching it. Afterwards it counts as launched through Claire. The token's Claire Proof page reads **Migrated to Claire** and the token gets everything a Claire launch has, except launch-only items such as the locked opening buy: free locks, revenue and price locks, [airdrops to $CLAIRE holders](../../claire/index.md), holder rounds, the buyback through the router, and a creator share paid to you, a vault or a split.

| Migration at a glance | |
| --- | --- |
| Fee | USD 25 once, in the chain's fee stablecoin (USDG on Robinhood Chain), charged only if the adoption succeeds |
| From then on | Claire takes 10% of everything the fee router receives |
| Stays yours | Fees the token earned before migration |
| Who can migrate | The creator's designated wallet, once, on Robinhood Chain |
| Where to start | **Bring this token to Claire** on the Token page or the **Creator fees** page |

**What it costs.** A one-time **USD 25** migration fee in the chain's fee stablecoin (USDG on Robinhood Chain), split evenly between the Claire treasury and $CLAIRE holders and paid in the same transaction as the adoption. If the adoption reverts, nothing is charged. From migration onward Claire takes **10%** of everything the fee router receives, the same as for a launch (see [Claire protocol fees](fees.md)).

**What stays yours.** Migration is a clean cutoff. Fees the token earned before it are yours, uncharged and never counted as Claire revenue: fees still on the bonding curve or in the graduated pool, anything that reached the router before adoption, and your share of an existing buyback vest. Claire's 10% applies only to what arrives after. Fees already sitting in your own pons escrow balance are untouched. Because these earlier amounts never count as revenue, they cannot advance a revenue lock.

### Good to know before you start

:::details[Unswept fees must be settled first]
The migration reverts with `UnsweptFees` while creator-side fees or a buyback balance remain unswept on the curve or on the graduated pool, in either currency, and only pons' fee-sweep operator can settle them. Sweep what you can before you start, and if the transaction still reverts, wait for the operator to sweep and try again. Nothing is lost by waiting.
:::
:::details[The buyback vest]
If the token has pons buyback on, the creator's share of the vest that has not been released yet is set aside at migration. The first launch tokens the router receives from that vest are paid to you uncharged. Only buybacks after migration are Claire revenue, and a few wei can shift between the two because of rounding.
:::
:::details[pons keeps its own powers]
The Claire contracts cannot remove them. pons' 2-of-3 Safe admin can propose a different creator-fee recipient through a public 3-day timelock, run the fee-sweep operator and disable a launch's buyback, and its fee escrow accepts credits from anyone. See [pons admin powers](pons-admin-powers.md). Review them before you migrate.
:::
:::details[The router cannot move fees away later]
The router has no function that sends the creator-fee recipient elsewhere, and only pons' own administration can change it. After migration your fees reach you only through the router's split.
:::

Only the creator's designated wallet can migrate, once, on Robinhood Chain. The token's pons creator-fee recipient must be that wallet before you start.

## Migration steps

Owners and admins see **Bring this token to Claire** on a linked pons token that is not registered with Claire. It is a card on the Token page and on the **Creator fees** page. The dialog walks through these steps, each signed by the designated wallet and verified from its receipt:

:::steps

### What changes

Read the explanation: Claire's 10% from now on, fees earned before stay yours, pons' admin powers, the router cannot move fees away later, and the USD 25 fee.

### Your choices

Set the starting project-holder share and the creator share (**Me**, a **Vesting vault** or a **Split**). The buyback stays as it is. Afterwards you can [raise the holder share and change the creator share's recipient with 7 days' notice](creator-share-and-split.md#change-the-split-after-launch); the holder share can never be lowered.

### Vault or split

Only if you chose one: deploy it.

### Fee router

Deploy the token's Claire fee router.

### Fee

Buy the USD 25 migration fee in USDG with ETH if the wallet lacks it, then approve it to the router.

### Settle pending fees

The creator's own pons sweep is offered and credits the fees to you uncharged. If only pons' fee-sweep operator can settle what is left (a buyback balance, or memecoin-side fees after graduation), the dialog explains this and blocks the next steps until the operator has swept. This is the `UnsweptFees` condition.

### Checklist

A preflight confirms the router is this creator's empty router, the token is not yet registered, no operator-only balance remains, and the fee balance and allowance are ready.

### Move the pons fee recipient

Move it to the router (`transferCreatorFeeRecipient`). It takes effect immediately.

### Adopt

The router pays the fee, registers the token and emits `Adopted`.
:::

> [!WARNING]
> Step 8 takes effect immediately. The router has no function that sends the creator-fee recipient elsewhere, so only pons' own administration can change it afterwards, through a public 3-day timelock. Review [pons admin powers](pons-admin-powers.md) first.

When it settles, the token's Claire features switch on and the token's Claire Proof page reads **Migrated to Claire {date}**. Anyone can [verify it](../../verification/launch-and-router.md#verify-a-launch): the launch path is `migrated`.

:::details[Migration stopped halfway]
If the recipient moved but the adoption did not happen, reopen the dialog: it resumes at **Finish migration**, derived from the chain. Do not resend an uncertain transaction; use **Check or recover** as for a [launch](launch.md#launch-steps).
:::
