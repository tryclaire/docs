---
title: Token
order: 6
---

# Token

Token tools are optional. Link a pons token launched on Robinhood Chain by contract address; Claire verifies the launch against supported pons factories.

## Inspect observations

The Token page brings together market observations, on-chain launch information, transfers, holders, historical snapshots, and creator fee information. Provider observations and the holder index have their own timestamps. A page load is not proof that upstream data was just collected.

## Work with holder snapshots

Holder counts exclude the pons factory, zero address, burn address, and liquidity pool. The deployer is not excluded by default. For a snapshot, filter by minimum balance and optionally exclude the deployer.

Snapshots use indexed transfer history. They are unavailable while the index is still filling; a past snapshot reflects indexed coverage, not an independent chain scan. You can preview a snapshot and export holder rows.

> [!CAUTION]
> A full snapshot response includes at most 10,000 holders and marks itself `truncated` when more match. Do not treat a truncated export as the entire distribution.

## Read creator fee figures

Creator fee figures come from the launch contracts. Claire estimates the claimable amount with a read-only on-chain call and never sends a claim transaction. It does not buy tokens, move funds, or claim fees for you. See [current limits](../reference/index.md) for additional bounds.
