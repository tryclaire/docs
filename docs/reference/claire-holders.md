---
title: $CLAIRE holders and referrals
order: 15
---

# $CLAIRE holders and referrals

> [!IMPORTANT]
> Planned and not available. Holder benefits need $CLAIRE to exist; referral payouts need the [Claire protocol](../sources/token-actions.md#planned-claire-protocol-fees) to be deployed; launch airdrops need both. Neither has happened: no $CLAIRE address is published, and the contracts are not deployed to any public network. Until then Claire shows **$CLAIRE is not live yet** and checks no holdings. The rules below describe the current implementation; they can change before release and are not a promise of income, rewards or returns.

## Verify a wallet

In your personal **$CLAIRE** page, connect a wallet and sign a one-time message that is valid for five minutes. Signing proves control; it moves no funds and grants no spending rights. Only ordinary wallets (externally owned accounts) are accepted, not smart-contract wallets, and an address can belong to one Claire account. Your first verified wallet also becomes your referral payout wallet; you can choose another verified wallet. Unlinking a wallet stops its $CLAIRE counting immediately and changes nothing on-chain.

## Holder benefits

- **Threshold:** 2,500 $CLAIRE held across your verified wallets. Only wallet balances count; $CLAIRE in locks, vesting or unclaimed distribution rounds does not.
- **One finalized block for everyone:** Claire reads balances at a finalized Ethereum block that its $CLAIRE holder index fully covers, for every account at the same block, so moving tokens between wallets cannot qualify two accounts. Holdings are checked about every 15 minutes and after you verify or unlink a wallet. If the data is unavailable, nothing is granted or removed.
- **One target:** the top plan applies to you or to one organization you belong to. You can move it once every 30 days; if you leave that organization, it stops applying there and you can move it right away.
- **Nothing is deleted:** if your verified holding falls below 2,500, only this benefit ends. Items created above the lower limits are kept and only new ones are refused. An independently paid plan is never overridden or removed; no paid plan is offered today.

| Limit | Early access | Top plan |
| --- | --- | --- |
| Organization storage | 2 GiB | 10 GiB |
| Unarchived automation rules per organization | 10 | 25 |
| Developer API requests per minute per key | 120 | 360 |
| Developer API requests per minute per organization | 600 | 1,800 |
| Workspaces with figures on your personal Home | 25 | 100 |

Early access applies everywhere today. The Developer API's per-IP limit is the same on both. Responses report the applicable limit in `RateLimit-Limit`.

## Referral rewards

Your invite link on the personal **Referrals** page counts link opens (unverified), sign-ups and paying projects separately. An organization keeps the referrer of the account that created it.

When such an organization pays a Claire service fee that confirms on-chain, you receive **5% of Claire's treasury half** of that fee, or **7.5%** if your verified holding qualifies when the reward is recorded:

| Service fee | Claire treasury half | Reward at 5% | Reward at 7.5% |
| --- | --- | --- | --- |
| Launch, USD 10 | 5 | 0.25 | 0.375 |
| Locking a token launched elsewhere, USD 25 | 12.5 | 0.625 | 0.9375 |

- A reward is never a share of trading revenue, of the $CLAIRE holder half or of project-holder funds.
- Self-referrals are void: there is no reward when you belong to the paying organization, made the payment yourself, or paid from one of your verified wallets. If a payment is reorganized off the chain and confirms again, this is checked again.
- A reward becomes payable once the payment's block is finalized. Claire's treasury then funds payable rewards in a claim round on the fee's chain, in the fee's stablecoin (USDG on Robinhood Chain, USDC on Ethereum). Funding a round is not a payout: the reward reaches your payout wallet when a claim is submitted, by you or anyone. A reward waits while you have no verified payout wallet.
- No paid plan, price or payment provider exists. A future plan payment would be recorded for its referrer without an amount until Claire's share of plan revenue and a settlement path are decided.

## Launch airdrops to $CLAIRE holders

A project can choose to airdrop part of a token it launched through Claire to $CLAIRE holders. It is optional, decided by each project and never promised.

1. An owner or admin enters the total and a minimum $CLAIRE balance in **Token → Airdrops**.
2. They take a snapshot at a finalized $CLAIRE block; Claire refuses it while the holder index is incomplete. Allocations are pro rata to $CLAIRE balances at that block and rounded down. A holder whose share rounds to zero receives nothing, and remainders are never funded. Every contract address, Claire system addresses (such as the treasury and the referral payout publisher) and the project's designated wallet are excluded.
3. The owner approves exactly the reviewed snapshot (its evidence hash).
4. The designated wallet deploys the token's airdrop distributor once, approves the exact total, then funds and publishes the round in one transaction. While a funding transaction may still publish, Claire refuses a second funding or a cancellation; the next airdrop can be drafted once the previous round is final.

The public proof at `/airdrops/<id>` shows the rule, snapshot block, Merkle root, evidence hash, funding transaction and, for any address, its allocation and proof, plus a manifest whose keccak-256 hash is the on-chain evidence. Holders claim on the token's chain with the same address that held $CLAIRE; anyone can submit a claim, and tokens go only to the listed address. Robinhood Chain tokens use the Ethereum $CLAIRE snapshot, which is why contract addresses are excluded: their owners may not control the same address on Robinhood Chain. Unclaimed allocations stay claimable; there is no expiry or clawback.

## Open decisions

These are not decided, and nothing above should be read as their answer:

- The top-plan limits and the 30-day move interval (current values above).
- A paid plan's price and provider, Claire's share of plan revenue and how its referral rewards would be settled.
- Who prepares referral payout rounds and which address publishes them in production.
- The production list of addresses excluded from airdrop snapshots.
- Whether $CLAIRE in locks, vesting or unclaimed rounds should count toward 2,500.
- Whether unclaimed airdrop allocations should ever expire.
- The $CLAIRE token address.
