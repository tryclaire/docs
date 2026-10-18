---
title: Token actions
description: Designate a wallet, launch or migrate a token, fund locks, publish payout rounds and share Claire Proof.
icon: bolt
order: 8
---

# Token actions

In **Token**, the **signing wallet** button designates the project's wallet and lists its transactions. With no token linked, **Launch a token** opens the launch setup, saved as a draft until you launch it; once a token is linked, **Vesting** funds and publishes locks. Robinhood Chain (pons v2) is the only network open today; Ethereum (Stockereum) is **coming soon** and cannot be selected. Robinhood Chain requires ETH for gas. Token tools are optional.

> [!IMPORTANT]
> Ethereum is coming soon; do not plan a launch, link or lock on it.

## At a glance

| Task | Where | Who |
| --- | --- | --- |
| [Designate the signing wallet](signing-wallet.md) | **Token → signing wallet** | The project owner signs a verification challenge |
| [Launch a token](launch.md) | **Token → Launch a token** | Owners and admins prepare it; the designated wallet signs |
| [Bring a linked token to Claire](linking-and-migration.md#bring-a-linked-token-to-claire) | **Bring this token to Claire** on the Token page | The creator's designated wallet, once |
| [Change the split](creator-share-and-split.md#change-the-split-after-launch) | **Creator fees → Change the split** | The launcher only |
| [Lock tokens](vesting-and-locks.md#fund-a-vesting-allocation) | **Vesting → New lock** | Owners and admins prepare it; the designated wallet signs |
| [Publish a holder round](payout-rounds.md) | **Creator fees → Publish holder round** | The designated wallet |
| [Share proof](claire-proof.md) | The token's public proof page at `/proof/<chainId>/<token>` and the badge | Anyone, no sign-in |

## Three ways in on Robinhood Chain

| | Launch through Claire | Link an existing pons token | Migrate a linked token to Claire |
| --- | --- | --- | --- |
| For | A new pons token | A token you already launched on pons | A linked token you want to bring fully into Claire |
| On-chain | Claire launches it for you | Nothing | Fee recipient moved to a Claire router, then `adopt` |
| You get | Everything | The workspace only | Everything except launch-only items |
| Claire fees | USD 10 launch fee, 10% of trading revenue | None. Date locks cost USD 25 per funding transaction | USD 25 once, 10% of trading revenue from migration onward |

**1. Launch through Claire (recommended).** Every feature: the fee router, creator share to you, a vault or a split, holder rounds, free locks including revenue and price locks, [airdrops to $CLAIRE holders](../../claire/index.md), the buyback and the locked opening buy. See [Launch a token](launch.md).

**2. Link an existing pons token.** Use **Link your token** on the Token page or in **Settings → Connections**. You get the workspace: market data, holders, graduation, snapshots, community and the API. Its Claire Proof page reads "Not launched through Claire". Nothing happens on-chain and no Claire contract is involved. Date locks stay available as an opt-in at the USD 25 lock fee.

**3. Bring this token to Claire (migration).** See [Bring a linked token to Claire](linking-and-migration.md#bring-a-linked-token-to-claire).

## Explore token actions

:::cards{cols=2}
::card[Signing wallet]{href=signing-wallet.md icon=key}
Designate the wallet that signs for your workspace.
::card[Launch a token]{href=launch.md icon=rocket}
The launch steps, form, pons v2 options, buyback and locked opening buy.
::card[Link and migrate]{href=linking-and-migration.md icon=link}
Link an existing pons token or bring it fully into Claire.
::card[Creator share and split]{href=creator-share-and-split.md icon=users}
Choose the payee and change the split after launch.
::card[Claire protocol fees]{href=fees.md icon=receipt}
Trading revenue split and service fees.
::card[Vesting and locks]{href=vesting-and-locks.md icon=lock}
Fund date locks, publish proof and claim payouts.
::card[Revenue and price locks]{href=revenue-and-price-locks.md icon=chart}
Unlock tranches as revenue or price targets are reached.
::card[Payout rounds]{href=payout-rounds.md icon=flow}
Cumulative holder, airdrop and referral rounds.
::card[Claire Proof]{href=claire-proof.md icon=shield}
The public evidence page and badge for any supported token.
::card[pons admin powers]{href=pons-admin-powers.md icon=warning}
The powers pons keeps and how Claire monitors the fee recipient.
:::
