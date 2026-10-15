---
title: Token actions
order: 7
---

# Token actions

In **Token**, the **signing wallet** button designates the organization's wallet and lists its transactions. With no token linked, **Launch a token** opens the launch setup, saved as a draft until you launch it; once a token is linked, **Vesting** funds and publishes locks. Robinhood Chain uses pons v2; Ethereum uses Stockereum v3. Both networks require ETH for gas. Token tools are optional.

> [!IMPORTANT]
> New launches and new vesting locks run only through the [Claire protocol](#claire-protocol-fees), which is not deployed yet, so they are unavailable until it is. Linking an existing token, holder data, published proofs and claims for existing allocations keep working. Ethereum/Stockereum availability is also rollout-gated; confirm the network and available actions in Claire before funding a wallet or promising a launch.

## Verify the organization's wallet

1. Open the signing wallet, then select the network and the wallet that will sign. A plain wallet (no contract code on any Claire network) designated with one signature also becomes the wallet on each other network that has none yet; a contract wallet is designated per network.
2. An **organization owner** signs a short-lived verification challenge to prove control. This verifies the designation; it does not transfer funds or give Claire spending authority. Only the owner can designate or remove the wallet.
3. Owners and admins can prepare launches and locks, but the **designated wallet must sign**. Being an admin does not give someone another person's wallet keys. Members cannot manage launches or vesting allocations.

Removing the designation or a member does not revoke wallet keys, on-chain rights, or previously executed transactions. Claire records intent and verified chain outcomes, not private keys. It does not custody funds, sponsor gas, or sign transactions on your behalf.

## Launch and link a token

1. Deploy your workspace's **Claire fee router** from the designated wallet. Set the project-holder share of trading revenue when you deploy it; it cannot change afterwards. Each router launches one token.
2. Enter launch details on the chosen network. Robinhood pons v2 uses native ETH or a pair token that pons approves, and offers a creator tax; buybacks stay off. Stockereum v3 uses an enabled quote and a permitted swap fee. Creator fees go to your fee router, so Stockereum's holder-reward routing is not offered. Review the live factory settings and costs. An optional initial buy, where available, spends the pair token or wallet ETH; you can also [lock the opening buy](#lock-the-opening-buy).
3. Approve the Claire launch fee to your fee router, and for a pons pair token also the exact initial buy. The router takes them in the launch transaction. If the designated wallet lacks the fee's stablecoin, Claire first offers **Buy with ETH**: one Uniswap swap that buys exactly the missing amount, capped at 1% above the quote, and refunds unused ETH in the same transaction.
4. When the draft passes its checks, select **Launch** to walk through the signed transactions. Each one is prepared and shown for review first: the network, wallet, destination contract, calldata, ETH value, nonce, and costs. Preparing is not submission; submission is not confirmation.
5. Follow each transaction in the signing wallet's **Transactions** until it is verified. If submission is uncertain, use **Check or recover** to refresh it from the chain or verify a transaction hash you know was sent. **Do not resend** an uncertain transaction or abandon it unless you know it was never sent. Confirmations reduce, but do not eliminate, reorganization risk.
6. A verified launch is linked automatically only if the initiating user still has owner/admin access, the wallet designation is unchanged, and no different token is linked. A confirmed transaction can remain unassociated if those checks fail; read its status instead of launching again.

To link an existing supported token, use **Link your token** on the Token page or **Settings → Connections**, select its network and enter its contract address. Claire verifies the chain, factory, and designated wallet requirements. One workspace has one active linked token; resolve its existing link before starting a different launch.

The protocols have different economics. Stock-linked assets also involve issuer, oracle, market, and securities-compliance risks. See the [Token guide](token.md) before interpreting market or creator-fee figures.

## Fund a vesting allocation

Vesting requires a linked supported pons v2 or Stockereum v3 token that the chain's designated wallet launched. In **Vesting**, **New lock** opens a step-by-step dialog: enter the beneficiaries, exact token amounts, and UTC schedule. A **Claire token lock** holds one or many beneficiaries on one schedule:

- **Timelock:** the full amount becomes claimable at the end.
- **Linear:** tokens become claimable progressively between start and end.
- **Catch-up cliff:** nothing is claimable before the cliff; the fraction accrued since the start unlocks at the cliff, then vesting continues linearly.

A lock is **noncancelable and nontransferable** by default. You can turn on cancellation or beneficiary transfer at creation, before funding. Verify the beneficiaries, amounts, and dates carefully before funding.

1. Prepare and sign the exact ERC-20 approval from the designated wallet, unless sufficient allowance is already available. Approval grants the lock contract an allowance; it does not fund a lock. For a token launched elsewhere, also approve the Claire lock fee; if the wallet lacks the fee's stablecoin, buy it with ETH first, as for the launch fee. Wait for confirmation.
2. Separately prepare, review, sign, and confirm the funding transaction, which deposits the tokens into the lock contract.
3. Check the recorded outcome. Approval and funding each need gas. Review the destination, calldata, value, and nonce each time, and use the same recovery procedure if submission is uncertain.

## Publish proof and claim payouts

After funding is verified and associated with the workspace, an owner or admin can **Publish** the lock. The organization site links to `/locks/<chainId>/claire-<lockId>`, where anyone can inspect the beneficiary, schedule, contract, funding transaction, and on-chain locked, claimable, and withdrawn amounts.

This is evidence of a particular allocation, **not** an endorsement, payout guarantee, or liquidity lock. Unpublishing removes Claire's public listing/proof access; it does not hide on-chain addresses, transfers, or schedules.

Beneficiaries claim at `/vesting/<chainId>/claire-<lockId>`: a signed-in user can connect a wallet and prepare a payout claim without joining the organization. Anyone may submit and pay the network gas, or call `claim` on the lock contract directly, but tokens go only to the beneficiary recorded on-chain. The claim pays what is available when it executes; the displayed amount may change. Claims have no Claire fee.

Vesting with time alone does not send tokens automatically. Check the transaction outcome before relying on a payout. These beneficiary payouts are distinct from [creator-fee figures](token.md#read-creator-fee-figures), which remain read-only in Claire.

## Claire protocol fees

> [!IMPORTANT]
> The Claire protocol's contracts are not deployed to any public network, so nothing below can be used today, and none of it is a promise of income or returns.

Every token launch through Claire goes through the workspace's own **fee router**. The router carries out the launch on pons v2 or Stockereum v3 and becomes the token's creator-fee recipient. There is no fee-free launch path through Claire. Launchpad settings that keep fees flowing to the router stay available, including the quote asset, tax rate, fee tier and initial buy. Stockereum's holder-reward mode is not available, because it would bypass the router. The **Creator fees** page shows the router's total revenue.

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
- **Claims, unlocks, cancellations and transfers:** no Claire fee; gas still applies.

Before you sign, Claire shows the exact payment token and amount, the launchpad's own fees and a gas estimate.

When the paying organization was referred, a referral reward comes out of Claire's treasury half of a service fee, never out of trading revenue. Projects that launched through Claire can also choose to airdrop part of their token to $CLAIRE holders. Both are planned with the protocol; see [$CLAIRE holders and referrals](../reference/claire-holders.md).

Limits to keep in mind:

- Project-holder payouts are distributed in rounds that the designated wallet publishes from Claire's finalized holder index. Each round records its snapshot block and an evidence hash on-chain, and Claire serves the full allocation list as a manifest whose keccak-256 hash is that evidence, so anyone can recheck a round; see [Verify on-chain](../reference/verify-on-chain.md). The contract does not check the snapshot itself: a round is only as correct as the balances it was built from, which the verification guide lets you compare with the chain.
- On pons, anyone can credit a router's balance in the launchpad's fee escrow. Such a credit cannot be told apart from trading revenue, so it is split the same way.
- Launchpad administrators can change upstream settings between review and execution.

## Lock the opening buy

A launch can lock its opening buy. In the launch form, turn on the **Lock the opening buy** switch. It is off by default and appears only once you enter an initial buy. Off means a normal launch, where the bought tokens go straight to the designated wallet, exactly as described above.

With the switch on, choose a schedule in UTC (**Timelock**, **Linear** or **Cliff + linear**, as in [Fund a vesting allocation](#fund-a-vesting-allocation)) and whether the beneficiary can be transferred. The launch review lists the lock, and the fee router does the rest inside the launch transaction:

1. The router receives the bought tokens instead of the creator wallet and pays the launch fee. This registers the token as launched through Claire, which is why locking it costs nothing.
2. It locks **all** bought tokens for the creator in the [Claire token lock](../reference/protocol-contracts.md#clairetokenlock) on that schedule.
3. Unspent pair token or ETH is still returned to the creator wallet.

The lock is **never cancelable** by anyone, because the router that funds it has no way to cancel. Only transferability is chosen, and only at launch. There is no Claire lock fee on top of the launch fee. Claims are permissionless and pay only the creator, as for any lock. Once the launch confirms, the lock appears with your other locks, funded by the router, and you can publish it like any other. The router emits `OpeningBuyLocked(token, lockId, amount)`, so the lock can be [verified](../reference/verify-on-chain.md#verify-a-lock) like any other.

## Revenue locks

A **revenue lock** holds tokens of a token launched through Claire and releases them in tranches as that token's own trading revenue grows, instead of by date alone. Like every Claire lock, it needs the [protocol](#claire-protocol-fees) to be deployed.

In **Vesting → New lock**, **Unlock by** offers **Dates** or **Revenue milestones**. Revenue milestones appear only for a token launched through Claire whose fee router is set up. Choosing them replaces the schedule step, and the Options step is skipped because the lock is always noncancelable and nontransferable.

- **Milestones:** 1 to 10 rows, each a threshold of new router revenue, entered in the quote asset's own units, and an **Unlocks %** share. Thresholds strictly increase and the shares must add up to 100%. The dialog also shows the router's revenue so far.
- **Baseline:** thresholds are measured from the router's cumulative revenue at the moment the lock is created, so revenue earned earlier never counts.
- **Fallback date:** mandatory, in UTC and in the future. From that date on, everything is unlocked whatever the revenue.
- **Unlocked amount:** the lock amount times the summed shares of the milestones reached, rounded down; everything from the fallback date.
- **Beneficiaries:** up to 100 per funding transaction, all on the same milestones and fallback date.
- **Rules:** only tokens launched through Claire can be locked, there is no Claire fee, and a lock can be neither canceled nor transferred. Anyone can submit a claim, and the tokens go only to the beneficiary.
- **Proof and claims:** the public proof page is `/locks/<chainId>/revenue-<lockId>` and the claim page is `/vesting/<chainId>/revenue-<lockId>`, next to `claire-<lockId>` for date-based locks. The proof page shows revenue since the lock was created against its milestones and the fallback date; the locks table reads **Revenue milestones · fallback date**.

> [!NOTE]
> **What counts as revenue.** Revenue is the cumulative total the fee router collects from the launchpad's fee escrow, not only the creator's or the non-refundable share, and it includes deliberate third-party credits to the router's escrow balance. A credit cannot be told apart from trading revenue on-chain, so anyone willing to pay can bring milestones forward. The fallback date still bounds every lock.

Fee-on-transfer and rebasing tokens are rejected at funding. See the [contract reference](../reference/protocol-contracts.md#clairerevenuelock) and [Verify on-chain](../reference/verify-on-chain.md#verify-a-revenue-lock) to check a lock yourself.
