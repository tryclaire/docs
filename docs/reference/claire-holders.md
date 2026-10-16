---
title: $CLAIRE holders and referrals
order: 15
---

# $CLAIRE holders and referrals

> [!IMPORTANT]
> Not available yet. $CLAIRE launches directly on pons on Robinhood Chain, and no $CLAIRE address is published. Referral payouts and fee-share rounds need the [Claire protocol](../sources/token-actions.md#claire-protocol-fees), and launch airdrops need both; the contracts are not deployed to any public network. Until then Claire shows **$CLAIRE is not live yet** and checks no holdings. The rules below describe the current implementation and are not a promise of income, rewards or returns.

## What $CLAIRE is

$CLAIRE is launched directly on pons on Robinhood Chain, not through a Claire fee router. Its own trading fees go to the Claire treasury, not to holders. $CLAIRE holders receive **Claire protocol fees only**: half of the 10% Claire takes from the trading revenue of launches made through Claire, and half of the launch and lock service fees. The other half goes to the Claire treasury. Amounts depend on activity and can be zero.

Those fees arrive in a distributor for $CLAIRE holders on each chain and are paid in rounds, pro rata to $CLAIRE balances at a finalized Robinhood Chain block, in the asset they were earned in. The snapshot chain is always Robinhood Chain, where $CLAIRE lives. A round on Robinhood Chain pays the same address that holds $CLAIRE. A round on Ethereum (fees earned there, if any) is the cross-chain case: it pays the Robinhood snapshot's address on Ethereum, so every contract address is excluded, because its owner may not control the same address on Ethereum (a pool, a Safe or an exchange wallet would pay into an address nobody controls). Rounds are cumulative: a claim pays everything you are owed for an asset in one transaction, whenever you like, and anyone can submit it for you. See [Verify on-chain](verify-on-chain.md#verify-a-distribution-round) to check a round.

## Verify a wallet

In your personal **$CLAIRE** page, connect a wallet and sign a one-time message that is valid for five minutes. Signing proves control; it moves no funds and grants no spending rights. Only ordinary wallets (externally owned accounts) are accepted, not smart-contract wallets, and an address can belong to one Claire account. Your first verified wallet also becomes your referral payout wallet; you can choose another verified wallet. Unlinking a wallet stops its $CLAIRE counting immediately and changes nothing on-chain.

## Holder benefits

- **Threshold:** 25,000 $CLAIRE held across your verified wallets. Only wallet balances count; $CLAIRE in locks, vesting or unclaimed distribution rounds does not.
- **One finalized block for everyone:** Claire reads balances at a finalized Robinhood Chain block that its $CLAIRE holder index fully covers, for every account at the same block, so moving tokens between wallets cannot qualify two accounts. Holdings are checked about every 15 minutes and after you verify or unlink a wallet. If the data is unavailable, nothing is granted or removed.
- **One target:** the top plan applies to you or to one organization you belong to. You can move it once every 30 days; if you leave that organization, it stops applying there and you can move it right away.
- **Nothing is deleted:** if your verified holding falls below 25,000, only this benefit ends. Items created above the lower limits are kept and only new ones are refused. A Pro plan the organization paid for is never overridden or removed.

| Limit | Early access | Top plan |
| --- | --- | --- |
| Organization storage | 2 GiB | 10 GiB |
| Unarchived automation rules per organization | 10 | 25 |
| Developer API requests per minute per key | 120 | 360 |
| Developer API requests per minute per organization | 600 | 1,800 |
| Workspaces with figures on your personal Home | 25 | 100 |

Early access applies everywhere today. The Developer API's per-IP limit is the same on both. Responses report the applicable limit in `RateLimit-Limit`.

## Pro plan

An organization can buy the same limits as the top plan without holding $CLAIRE: **USD 49 per 30 days**, prepaid, no auto-renewal. Owners and admins pay from the organization's designated wallet in **Settings → General → Plan → Get Pro**, in USDG on Robinhood Chain or USDC on Ethereum, or by buying the stablecoin with ETH in one swap first. The payment goes to the Claire treasury and confirms on-chain; paying while Pro is active extends the paid period from its current end. Pro payments become available once the Claire protocol is deployed on that chain.

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
- A reward becomes payable once the payment's block is finalized. Claire's treasury then funds payable rewards in a claim round on the fee's chain, in the fee's stablecoin (USDG on Robinhood Chain, USDC on Ethereum). Funding a round is not a payout: the reward reaches your payout wallet when a claim is submitted, by you or anyone. A reward waits while you have no verified payout wallet.
- Pro payments are referral payments like service fees; the whole amount is treasury share, so the reward is 5% or 7.5% of USD 49 on the chain it was paid on.

## Launch airdrops to $CLAIRE holders

A project can choose to airdrop part of a token it launched through Claire to $CLAIRE holders. It is optional, decided by each project and never promised.

1. An owner or admin enters the total and a minimum $CLAIRE balance in **Token → Airdrops**.
2. They take a snapshot at a finalized $CLAIRE block on Robinhood Chain; Claire refuses it while the holder index is incomplete. Allocations are pro rata to $CLAIRE balances at that block and rounded down. A holder whose share rounds to zero receives nothing, and remainders are never funded. Every contract address, Claire system addresses (such as the treasury and the referral payout publisher) and the project's designated wallet are excluded.
3. The owner approves exactly the reviewed snapshot (its evidence hash).
4. The designated wallet deploys the token's airdrop distributor once, choosing **Claims close (UTC)** (at least 7 days out; the default is 90 days), approves the exact total, then funds and publishes the round in one transaction. While a funding transaction may still publish, Claire refuses a second funding or a cancellation; the next airdrop can be drafted once the previous round is final.

**Expiry and reclaim.** Every airdrop distributor has a `reclaimAfter` date fixed at deployment. Until it, holders claim at any time. From it, claims close, and the designated wallet that published the airdrop can reclaim whatever is left: the **Claims window** card offers **Reclaim unclaimed tokens**. Claim before the date shown on the airdrop page and its public proof. Project-holder and $CLAIRE-holder distributions have no expiry.

The public proof at `/airdrops/<id>` shows the rule, snapshot block, Merkle root, evidence hash, expiry, funding transaction and, for any address, its allocation and proof, plus a manifest whose keccak-256 hash is the on-chain evidence. Holders claim on the token's chain with the same address that held $CLAIRE; anyone can submit a claim, and tokens go only to the listed address. On the claim page, **Claim everything owed** collects the whole cumulative amount for an asset in one transaction. Tokens on Robinhood Chain pay the same address that holds $CLAIRE. For a token on Ethereum the payout is cross-chain, so contract addresses are excluded.

## Published at launch

These are fixed when $CLAIRE and the protocol are deployed, and nothing above should be read as their answer in advance:

- The $CLAIRE token address.
- The top-plan limits and the 30-day move interval (current values above).
- A paid plan's price and provider, Claire's share of plan revenue and how its referral rewards are settled.
- Who prepares referral payout rounds and which address publishes them in production.
- The production list of addresses excluded from snapshots.
- Whether $CLAIRE in locks, vesting or unclaimed rounds counts toward 25,000.
