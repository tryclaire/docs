---
title: Token
order: 6
---

# Token

Token tools are optional. Enter the contract address of a supported pons token on Robinhood Chain. Claire verifies the chain and supported launch factory. Your workspace has one active linked token at a time. Ethereum (Stockereum) is coming soon and cannot be selected.

There are [three ways in](token-actions.md#three-ways-in-on-robinhood-chain): launch a new token through Claire, link an existing pons token (workspace only, nothing on-chain), or [bring a linked token to Claire](token-actions.md#bring-a-linked-token-to-claire). Launches and vesting require a [designated signing wallet](token-actions.md).

> [!NOTE]
> Ethereum is coming soon. Do not plan a launch, link or lock on it.

## Inspect observations

**Token** brings together the market (a price or holders chart, recent trades and top holders) and, beside it, the token itself, its market figures and its creator fees. **Creator fees**, **Vesting** and **Snapshots** are its sub-pages. Provider observations and the holder index have their own timestamps. A page load is not proof that upstream data was just collected.

pons v2 uses a bonding curve in its chosen quote (native ETH or an approved pair token) before graduation.

## pons v2 stages and market data

A pons v2 token moves through stages, which the token card shows:

| Stage | What it means |
| --- | --- |
| **Bonding curve** | Trading happens on the curve. The card shows the amount raised against the amount needed to graduate. The token graduates by itself when the curve sells out. |
| **Sold out · graduating** | The curve is full. Buying and selling on the curve are closed while the token graduates, which is automatic and needs no action. |
| **Graduated to Uniswap V4** | The token trades in a Uniswap v4 pool and its liquidity is locked in the pool permanently. |
| **Rescued by pons** | pons returned the raise and no pool exists. |

The supply is split into **Circulating**, **Locked by pons** (held by pons' locker, never a holder) and **On the curve**.

Before graduation the market figures and chart come from the curve, read by its address; after graduation they come from the v4 pool, and candles and trades continue across the change. The pair row shows the curve address until a pool exists. Prices and market caps are in the pair's own units; USD is shown only when the market is priced in that exact quote, otherwise it is unavailable.

Claire also re-reads who pons pays the token's creator fees to, on every load of the token page. If a token launched through Claire no longer pays its fee router, or pons has proposed a change, a warning appears; see [pons admin powers and fee-recipient monitoring](token-actions.md#pons-admin-powers-and-fee-recipient-monitoring).

## Work with holder snapshots

Holder counts exclude the applicable factory, zero address, burn address, applicable liquidity pool or pool manager, and launchpad contracts that hold tokens for others (such as a fee escrow). The deployer is not excluded by default. For a snapshot, filter by minimum balance and optionally exclude the deployer.

Raw balances are in the token's smallest unit, scaled by the token's own decimals. The holder index advances only to the chain's finalized block and re-indexes from the last matching block if the chain reorganizes, so holder figures trail the newest block (on Robinhood Chain by roughly 15 minutes).

Snapshots use indexed transfer history. They are unavailable while the index is still filling; a past snapshot reflects indexed coverage, not an independent chain scan. You can preview a snapshot and export holder rows.

> [!CAUTION]
> A full snapshot response includes at most 10,000 holders and marks itself `truncated` when more match. Do not treat a truncated export as the entire distribution.

## Read creator fee figures

Where provided for pons, creator fee figures come from the launch contracts. Claire estimates the claimable amount with a read-only on-chain call and never sends a creator-fee claim transaction. See [current limits](../reference/index.md) for additional bounds.

This read-only **creator-fee** display is separate from [wallet-signed launches, approvals, vesting funding, and beneficiary payout claims](token-actions.md). Claire does not custody funds or sign those transactions for you.

Launches through the Claire protocol route creator fees through a fee router instead, and the **Creator fees** page then shows the router's total revenue. See [Claire protocol fees](token-actions.md#claire-protocol-fees).
