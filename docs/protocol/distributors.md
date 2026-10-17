---
title: Distributors
description: The distributor that pays cumulative roots, and the factory that deploys it.
icon: gift
order: 56
---

# Distributors

## ClaireDistributor

Holds one recipient group's entitlement and pays it from cumulative roots. Per asset the immutable publisher posts a Merkle root over leaves `(chainId, distributor, asset, account, cumulativeAmount)` with `cumulativeTotal`, the most the group has ever been promised in that asset. The root replaces the asset's previous one; every root stays in the round history. A claim pays the account its cumulative amount minus what it already claimed, so one claim collects everything owed across all rounds. Funds leave only through claims, except for an airdrop's reclaim.

**Immutables:** `publisher`, `group` (a label of the recipient group) and `reclaimAfter` (`0` means never; airdrop distributors always set it).

Functions:

| Function | Purpose |
| --- | --- |
| `publish(asset, total, merkleRoot, snapshotBlock, evidence)` | Publisher only. Publishes a new root over funds the distributor already holds. `total` is the new `cumulativeTotal`. |
| `fundAndPublish(asset, total, merkleRoot, snapshotBlock, evidence)` | Same arguments. First pulls exactly the increase of the cumulative total from the publisher (ERC-20 only), so funding and publication are one transaction. |
| `claim(asset, account, cumulative, proof)` | Anyone. Verifies against the asset's latest root and pays `account` its cumulative amount minus what it already claimed. Funds go only to `account`. |
| `reclaim(asset)` | Publisher only, only from `reclaimAfter`. Takes back what the contract still holds. |
| `leaf(asset, account, cumulative)` | The leaf hash, `keccak256(keccak256(abi.encode(chainid, distributor, asset, account, cumulative)))`. |
| `getRound(roundId)`, `roundCount()`, `root(asset)`, `cumulativeTotal(asset)`, `totalClaimed(asset)`, `claimed(asset, account)`, `outstanding(asset)`, `unreserved(asset)`, `closed()` | Reads. A round is `(asset, snapshotBlock, cumulativeTotal, root, evidence)`. |

A publication needs `balance >= cumulativeTotal - totalClaimed` for the asset, and `cumulativeTotal` never decreases. A claim can never push `totalClaimed` past `cumulativeTotal` (`TotalExceeded`), so a root that over-promises cannot drain funds beyond the published total. From `reclaimAfter` claims and publication close. The publisher can misallocate a root it publishes, but cannot withdraw (before `reclaimAfter`), exceed funded balances, or replay a proof on another asset, distributor or chain. `snapshotBlock` is recorded, not checked. `evidence` is a commitment to the round's manifest, which you can check with [Verify on-chain](../verification/rounds-and-manifest.md#verify-a-distribution-round).

**Events:** `RoundPublished(roundId, asset, cumulativeTotal, root, snapshotBlock, evidence)`, `Claimed(asset, account, amount, cumulative, caller)`, `Reclaimed(asset, amount)`.

**Errors:** `Unauthorized`, `InvalidRound`, `InvalidProof`, `InsufficientFunds(asset, available, requested)`, `TotalExceeded(asset)`, `NothingToClaim(asset, account)`, `Closed`, `NotClosed`, `InvalidConfiguration`.

## ClaireDistributorFactory

Deploys distributors with CREATE2: `deploy(publisher, group, reclaimAfter, salt)` and `predict(deployer, publisher, group, reclaimAfter, salt)`. The caller is part of the salt, so the router factory's distributors cannot be pre-empted. It holds no state and no funds.
