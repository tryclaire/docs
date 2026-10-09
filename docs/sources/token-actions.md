---
title: Token actions
order: 7
---

# Token actions

Use **Token actions** in your organization's Token area to designate a signing wallet, launch a supported token, and fund or publish a vesting allocation. Robinhood Chain uses pons v2; Ethereum uses Stockereum v3. Both networks require ETH for gas. Token tools are optional.

> [!IMPORTANT]
> New launches and new vesting locks run only through the [Claire protocol](#planned-claire-protocol-fees), which is not deployed yet, so they are unavailable until it is. Linking an existing token, holder data, published proofs and claims for existing allocations keep working. Ethereum/Stockereum availability is also rollout-gated; confirm the network and available actions in Claire before funding a wallet or promising a launch.

## Verify the organization's wallet

1. Select the network and connect the wallet that will sign. Each chain has its own designated wallet.
2. An **organization owner** signs a short-lived verification challenge to prove control. This verifies the designation; it does not transfer funds or give Claire spending authority. Only the owner can designate or remove the wallet.
3. Owners and admins can prepare launches and locks, but the **designated wallet must sign**. Being an admin does not give someone another person's wallet keys. Members cannot manage launches or vesting allocations.

Removing the designation or a member does not revoke wallet keys, on-chain rights, or previously executed transactions. Claire records intent and verified chain outcomes, not private keys. It does not custody funds, sponsor gas, or sign transactions on your behalf.

## Launch and link a token

1. Deploy your workspace's **Claire fee router** from the designated wallet. Set the project-holder share of trading revenue when you deploy it; it cannot change afterwards. Each router launches one token.
2. Enter launch details on the chosen network. Robinhood pons v2 uses native ETH or a pair token that pons approves, and offers a creator tax; buybacks stay off. Stockereum v3 uses an enabled quote and a permitted swap fee. Creator fees go to your fee router, so Stockereum's holder-reward routing is not offered. Review the live factory settings and costs. An optional initial buy, where available, spends the pair token or wallet ETH.
3. Approve the Claire launch fee to your fee router, and for a pons pair token also the exact initial buy. The router takes them in the launch transaction. If the designated wallet lacks the fee's stablecoin, Claire first offers **Buy with ETH**: one Uniswap swap that buys exactly the missing amount, capped at 1% above the quote, and refunds unused ETH in the same transaction.
4. Select **Prepare launch**. Review the network, wallet, destination contract, calldata, ETH value, nonce, and costs before signing. Preparing is not submission; submission is not confirmation.
5. Check **Transaction history and recovery** until the transaction is verified. Use **Refresh** or attach the known transaction hash if submission is uncertain. **Do not resend** an uncertain transaction or abandon it unless you know it was never sent. Confirmations reduce, but do not eliminate, reorganization risk.
6. A verified launch is linked automatically only if the initiating user still has owner/admin access, the wallet designation is unchanged, and no different token is linked. A confirmed transaction can remain unassociated if those checks fail; read its status instead of launching again.

To link an existing supported token, use **Organization → Connections**, select its network and enter its contract address. Claire verifies the chain, factory, and designated wallet requirements. One workspace has one active linked token; resolve its existing link before starting a different launch.

The protocols have different economics. Stock-linked assets also involve issuer, oracle, market, and securities-compliance risks. See the [Token guide](token.md) before interpreting market or creator-fee figures.

## Fund a vesting allocation

Vesting requires a linked supported pons v2 or Stockereum v3 token that the chain's designated wallet launched. Enter the beneficiaries, exact token amounts, and UTC schedule. Claire uses its own **Claire token lock**, which holds many beneficiaries on one schedule; tokens launched through Claire can also use **Sablier Lockup v4**. Both support:

- **Timelock:** the full amount becomes claimable at the end.
- **Linear:** tokens become claimable progressively between start and end.
- **Catch-up cliff:** nothing is claimable before the cliff; the fraction accrued since the start unlocks at the cliff, then vesting continues linearly.

Sablier allocations are **noncancelable and nontransferable**. A Claire lock is noncancelable and nontransferable unless you turn on cancellation or beneficiary transfer before funding. Verify the beneficiaries, amounts, and dates carefully before funding.

1. Prepare and sign the exact ERC-20 approval from the designated wallet, unless sufficient allowance is already available. Approval grants the lock contract an allowance; it does not fund a lock. For a token launched elsewhere, also approve the Claire lock fee; if the wallet lacks the fee's stablecoin, buy it with ETH first, as for the launch fee. Wait for confirmation.
2. Separately prepare, review, sign, and confirm the funding transaction, which deposits the tokens into the lock contract.
3. Check the recorded outcome. Approval and funding each need gas. Review the destination, calldata, value, and nonce each time, and use the same recovery procedure if submission is uncertain.

## Publish proof and claim payouts

After funding is verified and associated with the workspace, an owner or admin can **Publish** the lock. The organization site links to `/locks/<chainId>/<streamId>` for a Sablier stream or `/locks/<chainId>/claire-<lockId>` for a Claire lock, where anyone can inspect the beneficiary, schedule, contract, funding transaction, and on-chain locked, claimable, and withdrawn amounts.

This is evidence of a particular allocation, **not** an audit, endorsement, payout guarantee, or liquidity lock. Unpublishing removes Claire's public listing/proof access; it does not hide on-chain addresses, transfers, or schedules.

At `/vesting/<chainId>/<streamId>`, a signed-in user can connect a wallet and prepare a beneficiary payout claim for a Sablier stream without joining the organization. Anyone may submit and pay the network gas and quoted Sablier withdrawal fee, but tokens go only to the beneficiary recorded on-chain. The claim withdraws what is available when it executes; the displayed amount may change. A Claire lock is claimed from the funding organization's Vesting page, or by anyone calling `claim` on the lock contract; it also pays only the beneficiary and charges no claim fee.

Vesting with time alone does not send tokens automatically. Check the transaction outcome before relying on a payout. These beneficiary payouts are distinct from [creator-fee figures](token.md#read-creator-fee-figures), which remain read-only in Claire.

## Planned: Claire protocol fees

> [!IMPORTANT]
> The Claire protocol is planned and not available. Its contracts are not deployed to any public network and have not been audited, so nothing below can be used today. The design can change before release, and none of it is a promise of income or returns.

When it is enabled, every token launch through Claire goes through the workspace's own **fee router**. The router carries out the launch on pons v2 or Stockereum v3 and becomes the token's creator-fee recipient. There is no fee-free launch path through Claire. Launchpad settings that keep fees flowing to the router stay available, including the quote asset, tax rate, fee tier and initial buy. Stockereum's holder-reward mode is not available, because it would bypass the router.

**Trading revenue** is everything the router claims from the launchpad's fee escrow. That includes project tax and the creator's base trading fees, and covers curve sweeps, the graduation credit and later pool sweeps. Trading volume, upstream platform and liquidity fees, gas and anything sent straight to the router are not trading revenue and are never charged. Each payout asset is split separately and paid in that asset, with no swap:

- **Claire takes 10%** of trading revenue, deducted from the creator's share and split evenly between the Claire treasury and $CLAIRE holders.
- **Project holders** receive the share you set when you deploy the router, up to 90%. The share is fixed once the router is deployed.
- **The creator** receives the rest, including rounding remainders.

| Per 100 units of trading revenue | Claire treasury | $CLAIRE holders | Creator | Project holders |
| --- | --- | --- | --- | --- |
| Holder sharing off | 5 | 5 | 90 | 0 |
| Holder sharing at 50% | 5 | 5 | 40 | 50 |

**Service fees** are fixed amounts of one USD stablecoin per chain (USDG on Robinhood Chain, USDC on Ethereum), with no price oracle, so a depeg changes their real value but not the amount charged. You can pay them with ETH through the swap step above. Each fee is split evenly between the Claire treasury and $CLAIRE holders, and is separate from gas and launchpad fees:

- **Launch:** USD 10, taken by the router in the launch transaction and charged only if the launch succeeds.
- **Locking a token launched elsewhere:** USD 25 per funding transaction, however many beneficiaries. It is never a share of the locked tokens.
- **Locking a token launched through Claire:** free apart from gas. Eligibility comes from an on-chain registry that only Claire fee routers can write, for tokens they launched themselves. Importing or naming a token does not make it eligible.
- **Claims, unlocks, cancellations and transfers:** no Claire fee; gas, and Sablier's withdrawal fee for Sablier-held allocations, still apply.

Before you sign, Claire shows the exact payment token and amount, the launchpad's own fees and a gas estimate.

When the paying organization was referred, a referral reward comes out of Claire's treasury half of a service fee, never out of trading revenue. Projects that launched through Claire can also choose to airdrop part of their token to $CLAIRE holders. Both are planned with the protocol; see [$CLAIRE holders and referrals](../reference/claire-holders.md).

Limits to keep in mind:

- Project-holder payouts are distributed in rounds that the designated wallet publishes from Claire's finalized holder index. The published totals and allocations are trusted to be correct. Each round records its snapshot block and an evidence hash on-chain, but Claire does not yet publish the full allocation list needed to check that hash.
- On pons, anyone can credit a router's balance in the launchpad's fee escrow. Such a credit cannot be told apart from trading revenue, so it is split the same way.
- Launchpad administrators can change upstream settings between review and execution.
