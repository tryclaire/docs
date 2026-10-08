---
title: Token
order: 6
---

# Token

Token tools are optional. Select the network and enter the contract address of a supported pons token on Robinhood Chain or Stockereum v3 token on Ethereum. Claire verifies the selected chain and supported launch factory. Your workspace has one active linked token at a time.

New pons v2 and Stockereum v3 launches, linking, and vesting require a [designated signing wallet](token-actions.md). Retained supported pons launches remain readable.

> [!IMPORTANT]
> Ethereum/Stockereum availability is rollout-gated. Confirm that Ethereum actions are available for your workspace before funding a wallet or promising a launch.

## Inspect observations

The Token page brings together market observations, on-chain launch information, transfers, holders, historical snapshots, and available creator fee information. Provider observations and the holder index have their own timestamps. A page load is not proof that upstream data was just collected.

The launch protocols have different economics: pons v2 uses a native-ETH curve before graduation; Stockereum v3 uses permanent Uniswap V4 liquidity with an enabled quote, without a bonding curve or graduation stage. Stock-linked assets carry issuer, oracle, market, and securities-compliance risks.

## Work with holder snapshots

Holder counts exclude the applicable factory, zero address, burn address, applicable liquidity pool or pool manager, and launchpad contracts that hold tokens for others (such as a fee escrow). The deployer is not excluded by default. For a snapshot, filter by minimum balance and optionally exclude the deployer.

Raw balances are in the token's smallest unit, scaled by the token's own decimals. The holder index advances only to the chain's finalized block and re-indexes from the last matching block if the chain reorganizes, so holder figures trail the newest block (on Robinhood Chain by roughly 15 minutes).

Snapshots use indexed transfer history. They are unavailable while the index is still filling; a past snapshot reflects indexed coverage, not an independent chain scan. You can preview a snapshot and export holder rows.

> [!CAUTION]
> A full snapshot response includes at most 10,000 holders and marks itself `truncated` when more match. Do not treat a truncated export as the entire distribution.

## Read creator fee figures

Where provided for pons, creator fee figures come from the launch contracts. Claire estimates the claimable amount with a read-only on-chain call and never sends a creator-fee claim transaction. Stockereum fee and reward routing differs; do not interpret a pons creator-fee estimate as a Stockereum balance. See [current limits](../reference/index.md) for additional bounds.

This read-only **creator-fee** display is separate from [wallet-signed launches, approvals, vesting funding, and beneficiary payout claims](token-actions.md). Claire does not custody funds or sign those transactions for you.
