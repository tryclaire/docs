---
title: Holder benefits
description: Verify a wallet, unlock the top plan with 25,000 $CLAIRE or buy the same limits as a Pro plan.
icon: gift
order: 30
---

# Holder benefits

## Verify a wallet

In your personal **$CLAIRE** page, connect a wallet and sign a one-time message that is valid for five minutes. Signing proves control; it moves no funds and grants no spending rights.

:::steps

### Connect a wallet

Open your personal **$CLAIRE** page and connect the wallet that holds your $CLAIRE.

### Sign the message

Sign the one-time message, valid for five minutes.

### Choose a payout wallet

Your first verified wallet also becomes your referral payout wallet; you can choose another verified wallet.
:::

- Only ordinary wallets (externally owned accounts) are accepted, not smart-contract wallets.
- An address can belong to one Claire account.
- Unlinking a wallet stops its $CLAIRE counting immediately and changes nothing on-chain.

## How holdings are checked

- **One finalized block for everyone:** Claire reads balances at a finalized Robinhood Chain block that its $CLAIRE holder index fully covers, for every account at the same block, so moving tokens between wallets cannot qualify two accounts. Holdings are checked about every 15 minutes and after you verify or unlink a wallet. If the data is unavailable, nothing is granted or removed.

## The top plan

- **Threshold:** 25,000 $CLAIRE held across your verified wallets. Only wallet balances count; $CLAIRE in locks, vesting or unclaimed distribution rounds does not.

- **One target:** the top plan applies to you or to one project you belong to. You can move it once every 30 days; if you leave that project, it stops applying there and you can move it right away.

- **Nothing is deleted:** if your verified holding falls below 25,000, only this benefit ends. Items created above the lower limits are kept and only new ones are refused. A Pro plan the project paid for is never overridden or removed.

### Limits

| Limit | Early access | Top plan |
| --- | --- | --- |
| Project storage | 2 GiB | 10 GiB |
| Developer API requests per minute per key | 120 | 360 |
| Developer API requests per minute per project | 600 | 1,800 |
| Workspaces with figures on your personal Home | 25 | 100 |

Early access applies everywhere today. The Developer API's per-IP limit is the same on both. Responses report the applicable limit in `RateLimit-Limit`.

## Pro plan

A project can buy the same limits as the top plan without holding $CLAIRE: **USD 49 per 30 days**, prepaid, no auto-renewal. Owners and admins pay from the project's designated wallet in **Settings → General → Plan → Get Pro**, in USDG on Robinhood Chain, or by buying the stablecoin with ETH in one swap first. The payment goes to the Claire treasury and confirms on-chain; paying while Pro is active extends the paid period from its current end. Pro payments become available once the Claire protocol is deployed on that chain.

## Next steps

:::cards
::card[Earning as a holder]{href=earning.md icon=flow}
Fee rounds, airdrops and referral rewards.
::card[Limits reference]{href=../reference/limits.md#current-limits icon=list}
Every current application limit.
:::
