---
title: Earning as a holder
description: Fee rounds, optional launch airdrops and referral rewards, and how to claim each one.
icon: flow
order: 31
---

# Earning as a holder

| Way to earn | Who gets it | Paid how |
| --- | --- | --- |
| [Fee rounds](#fee-rounds) | Every holder, pro rata | Cumulative rounds, claimed by you or anyone |
| [Launch airdrops](#launch-airdrops) | Holders of a project's chosen snapshot | A project's own token, until its claims close |
| [Referral rewards](#referral-rewards) | Referrers of paying organizations | Treasury-funded rounds, to your payout wallet |

## Fee rounds

Claire's share of trading revenue and service fees arrives in a distributor for $CLAIRE holders and is paid in rounds.

- **Pro rata at a finalized block:** a round pays pro rata to $CLAIRE balances at a finalized Robinhood Chain block, in the asset the fees were earned in. A round pays the same address that holds $CLAIRE.
- **Whole balance of one asset:** each round distributes the distributor's unreserved balance of one asset. Fees can arrive in several assets, such as the fee stablecoin, ETH and pool quotes.
- **No minimum:** the 25,000 $CLAIRE threshold gates plan benefits, not fee rounds. Every other positive balance shares.
- **Who is excluded:** contracts, the deployer, the treasury, Claire's publisher addresses and the holder distributors get no share, and neither do the token's bonding curve, pons custody and the pool manager.

Rounds are cumulative: a claim pays everything you are owed for an asset in one transaction, whenever you like, and anyone can submit it for you. See [Verify on-chain](../verification/rounds-and-manifest.md#verify-a-distribution-round) to check a round.

Holders claim at `/distributions/<chainId>/<distributor>`, the same claim page used for [payout rounds](../sources/token-actions/payout-rounds.md); on it, **Claim everything owed** collects every round for an asset in one transaction.

Every round has a manifest whose keccak-256 is the round's on-chain evidence. See [Verify on-chain](../verification/rounds-and-manifest.md#verify-a-distribution-round) and the [round manifest](../verification/rounds-and-manifest.md#the-round-manifest).

## Launch airdrops

A project can choose to airdrop part of a token it launched through Claire, or [migrated to Claire](../sources/token-actions/linking-and-migration.md#bring-a-linked-token-to-claire), to $CLAIRE holders. It is optional, decided by each project and never promised.

### Steps for the project

:::steps

### Plan it

An owner or admin enters the total and a minimum $CLAIRE balance in **Token → Airdrops**.

### Take a snapshot

They take a snapshot at a finalized $CLAIRE block on Robinhood Chain; Claire refuses it while the holder index is incomplete. Allocations are pro rata to $CLAIRE balances at that block and rounded down. A holder whose share rounds to zero receives nothing, and remainders are never funded. Every contract address, Claire system addresses (such as the treasury and the referral payout publisher) and the project's designated wallet are excluded.

### Approve it

The owner approves exactly the reviewed snapshot (its evidence hash).

### Fund and publish

The designated wallet deploys the token's airdrop distributor once, choosing **Claims close (UTC)** (at least 7 days out; the default is 90 days), approves the exact total, then funds and publishes the round in one transaction. While a funding transaction may still publish, Claire refuses a second funding or a cancellation; the next airdrop can be drafted once the previous round is final.
:::

### Expiry and reclaim

Every airdrop distributor has a `reclaimAfter` date fixed at deployment. Until it, holders claim at any time. From it, claims close, and the designated wallet that published the airdrop can reclaim whatever is left: the **Claims window** card offers **Reclaim unclaimed tokens**. Claim before the date shown on the airdrop page and its public proof. Project-holder and $CLAIRE-holder distributions have no expiry.

### Public proof and claims

The public proof at `/airdrops/<id>` shows the rule, snapshot block, Merkle root, evidence hash, expiry, funding transaction and, for any address, its allocation and proof, plus a manifest whose keccak-256 hash is the on-chain evidence. Holders claim on the token's chain with the same address that held $CLAIRE; anyone can submit a claim, and tokens go only to the listed address. On the claim page, **Claim everything owed** collects the whole cumulative amount for an asset in one transaction. Tokens on Robinhood Chain pay the same address that holds $CLAIRE.

## Referral rewards

Your invite link on the personal **Referrals** page counts link opens (unverified), sign-ups and paying projects separately. An organization keeps the referrer of the account that created it.

When such an organization pays a Claire service fee or a Pro plan payment that confirms on-chain, you receive **5% of Claire's treasury share** of that payment, or **7.5%** if your verified holding qualifies when the reward is recorded:

| Payment | Claire treasury share | Reward at 5% | Reward at 7.5% |
| --- | --- | --- | --- |
| Launch, USD 10 | 5 | 0.25 | 0.375 |
| Locking a token launched elsewhere, USD 25 | 12.5 | 0.625 | 0.9375 |
| Pro plan, USD 49 | 49 | 2.45 | 3.675 |

- A reward is never a share of trading revenue, of the $CLAIRE holder half or of project-holder funds.
- Self-referrals are void: there is no reward when you belong to the paying organization, made the payment yourself, or paid from one of your verified wallets. If a payment is reorganized off the chain and confirms again, this is checked again.
- A reward becomes payable once the payment's block is finalized. Claire's treasury then funds payable rewards in a claim round on the fee's chain, in the fee's stablecoin (USDG on Robinhood Chain). Funding a round is not a payout: the reward reaches your payout wallet when a claim is submitted, by you or anyone. A reward waits while you have no verified payout wallet.
- Pro payments are referral payments like service fees; the whole amount is treasury share, so the reward is 5% or 7.5% of USD 49 on the chain it was paid on.

## Next steps

:::cards
::card[Payout rounds]{href=../sources/token-actions/payout-rounds.md icon=flow}
How cumulative rounds work for every kind of payout.
::card[Claire protocol fees]{href=../sources/token-actions/fees.md icon=receipt}
Where the fees and the treasury share come from.
::card[Launch a token]{href=../sources/token-actions/launch.md icon=rocket}
Airdrops need a token launched through Claire or migrated to it.
:::
