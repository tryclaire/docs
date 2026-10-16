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

1. Choose who receives the creator share in **Creator share** ([see below](#choose-who-is-paid)): **Me** (the designated wallet, the default), a **Vesting vault** or a **Split**. A vault or split is deployed first, from the designated wallet.
2. Deploy your workspace's **Claire fee router** from the designated wallet. Set the project-holder share of trading revenue when you deploy it; it cannot change afterwards, and neither can the creator share's recipient. Each router launches one token. A router that already exists is reused only when its recipient matches the draft.
3. Enter launch details on the chosen network. Robinhood pons v2 offers every native option: the [launch config, the quote, a creator tax, opening snipe-tax exemptions](#pons-v2-launch-options) and the [buyback](#pons-buyback). Stockereum v3 uses an enabled quote and a permitted swap fee. Creator fees go to your fee router, so Stockereum's holder-reward routing is not offered. Review the live factory settings and costs. An optional initial buy, where available, spends the pair token or wallet ETH; you can also [lock the opening buy](#lock-the-opening-buy).
4. Approve the Claire launch fee to your fee router, and for a pons pair token also the exact initial buy. The router takes them in the launch transaction. If the designated wallet lacks the fee's stablecoin, Claire first offers **Buy with ETH**: one Uniswap swap that buys exactly the missing amount, capped at 1% above the quote, and refunds unused ETH in the same transaction.
5. When the draft passes its checks, select **Launch** to walk through the signed transactions. Each one is prepared and shown for review first: the network, wallet, destination contract, calldata, ETH value, nonce, and costs. Preparing is not submission; submission is not confirmation.
6. Follow each transaction in the signing wallet's **Transactions** until it is verified. If submission is uncertain, use **Check or recover** to refresh it from the chain or verify a transaction hash you know was sent. **Do not resend** an uncertain transaction or abandon it unless you know it was never sent. Confirmations reduce, but do not eliminate, reorganization risk.
7. A verified launch is linked automatically only if the initiating user still has owner/admin access, the wallet designation is unchanged, and no different token is linked. A confirmed transaction can remain unassociated if those checks fail; read its status instead of launching again.

To link an existing supported token, use **Link your token** on the Token page or **Settings → Connections**, select its network and enter its contract address. Claire verifies the chain, factory, and designated wallet requirements. One workspace has one active linked token; resolve its existing link before starting a different launch.

The protocols have different economics. Stock-linked assets also involve issuer, oracle, market, and securities-compliance risks. See the [Token guide](token.md) before interpreting market or creator-fee figures.

### Choose who is paid

The wallet that launches is the **launcher** (the router's `creator`): the only wallet that can launch, switch the buyback or publish the project's holder rounds. The **payee** is who receives the creator share of every distribution. It is fixed when the router is deployed, and the launcher keeps no claim on revenue once another payee is set. Opening-buy tokens and launch change always go to (or are locked for) the launcher.

- **Me:** the payee is the launcher.
- **Vesting vault:** a contract that vests everything it receives to one beneficiary. Enter the beneficiary and a start, an optional cliff and an end in UTC. Nothing is released before the cliff; from the start the vested share grows linearly until the end, and everything is released from the end. It takes any token and ETH, and late deposits vest from the start. Anyone can trigger **Release**, which pays only the beneficiary.
- **Split:** a contract that divides everything it receives between 2 to 10 wallets by fixed percentages that must total exactly 100%. Anyone can trigger **Release**, which pays only those wallets. A wallet that rejects its payout is skipped and keeps its share without blocking the others; rounding remainders join the next release.

A vault or split has no owner, admin, upgrade, cancel or transfer, and Claire's vault factory records it so anyone can [verify](../reference/verify-on-chain.md#verify-the-payee) that a router's payee is genuine. On **Creator fees**, the vault or split card shows what is vested, released and ready to release per asset, and **Deferred payouts** lists a payout the router could not deliver, which anyone can retry with **Push to payee**.

### pons v2 launch options

The launch form on Robinhood Chain offers every option pons v2 itself offers:

- **Bonding curve (launch config):** when pons enables more than one, you choose among them. Each shows its opening market cap, graduation market cap and the amount raised to graduate, in the quote you picked. The curve is constant-product, and graduation is automatic once it sells out.
- **Quote asset:** native ETH or any pair token pons currently approves. A quote such as a tokenised stock carries its own risk: it can be paused or controlled by its issuer.
- **Creator tax:** an optional percentage you set on each trade. It is part of the trading revenue the router collects, so it is split like the rest.
- **Opening snipe tax and exemptions:** pons charges a snipe tax on buys right after a launch that starts at 99% and decays within seconds, and pays it back into the trading fee. **Opening snipe-tax exemptions** takes up to 32 additional wallets (one per line or separated by commas) that are exempt; they are saved with the draft.
- **Initial buy:** optional, in the pair token or wallet ETH, with slippage protection. It can be [locked](#lock-the-opening-buy).
- **Buyback:** see [pons buyback](#pons-buyback).

The launch review repeats the launch config, the graduation threshold and both market caps, and discloses the snipe tax, the quote-asset risk and pons' admin powers.

### pons admin powers and fee-recipient monitoring

The Claire contracts cannot remove powers pons keeps for itself. pons' administration is a 2-of-3 Safe. Among its powers, pons can propose a different creator-fee recipient for a launch; the change is public and executes only after a 3-day timelock, and the Claire router cannot block it. A new recipient would bypass the router's split. pons also runs a fee-sweep operator, can disable a launch's buyback, and its fee escrow accepts credits from anyone.

Claire re-reads the token's creator-fee recipient on every load of the token page. If pons now pays the token's creator fees to something other than its Claire fee router, or has proposed a change, the Token page and **Creator fees** show a warning: **This token's creator fees no longer go to its fee router**, or **pons has proposed moving this token's creator fees**, with the new recipient and the effective and expiry times in UTC. Check it before relying on the split.

### pons buyback

On pons, **Buyback** is off by default and is a switch at launch; the creator wallet can also turn it on or off later from **Creator fees**. When it is on:

- pons diverts part of the creator's quote fees to buy the launch token and vests it linearly over 5 years in its buyback vault. The vested tokens are credited to your fee router's escrow balance in the launch token.
- Only pons' fee-sweep operator can sweep while buyback is on, so quote revenue reaches the router after the operator has swept.
- You collect the vested tokens like any revenue, with **Collect and split** on the **Buyback** card: the router releases what has vested, claims it and splits it in launch tokens. The holder share goes to the project-holder distributor in that token (publish it with **Publish holder round**), and the payee gets the rest.
- **Claire's 10% applies to everything the router receives**, including the vested launch tokens: 10% of them, half to the treasury and half to $CLAIRE holders. The quote that pons diverts to the buyback never reaches the router, so it is never charged. Per unit of diverted fee, Claire earns less than without buyback, in launch tokens, over years.

## Fund a vesting allocation

Vesting requires a linked supported pons v2 or Stockereum v3 token that the chain's designated wallet launched. In **Vesting**, **New lock** opens a step-by-step dialog: enter the beneficiaries, exact token amounts, and UTC schedule. A **Claire token lock** holds one or many beneficiaries on one schedule:

- **Timelock:** the full amount becomes claimable at the end.
- **Linear:** tokens become claimable progressively between start and end.
- **Catch-up cliff:** nothing is claimable before the cliff; the fraction accrued since the start unlocks at the cliff, then vesting continues linearly.

A lock is **noncancelable and nontransferable** by default. You can turn on cancellation or beneficiary transfer at creation, before funding. Under **Cancelable** you can add a **Notice period (days)**: the funder must first select **Request cancel**, which starts a public countdown, and can select **Cancel** only after it ends (with no notice, **Cancel lock** works at once). The beneficiary keeps vesting and can claim during the notice, and the refund is computed when the cancellation executes. Verify the beneficiaries, amounts, and dates carefully before funding.

1. Prepare and sign the exact ERC-20 approval from the designated wallet, unless sufficient allowance is already available. Approval grants the lock contract an allowance; it does not fund a lock. For a token launched elsewhere, also approve the Claire lock fee; if the wallet lacks the fee's stablecoin, buy it with ETH first, as for the launch fee. Wait for confirmation.
2. Separately prepare, review, sign, and confirm the funding transaction, which deposits the tokens into the lock contract.
3. Check the recorded outcome. Approval and funding each need gas. Review the destination, calldata, value, and nonce each time, and use the same recovery procedure if submission is uncertain.

## Publish proof and claim payouts

After funding is verified and associated with the workspace, an owner or admin can **Publish** the lock. The organization site links to `/locks/<chainId>/claire-<lockId>` (`revenue-<lockId>` for a revenue lock, `price-<lockId>` for a price lock), where anyone can inspect the beneficiary, schedule, contract, funding transaction, and on-chain locked, claimable, and withdrawn amounts. A cancelable lock with a notice shows **Funder can cancel after a N-day notice**, then the date once a cancellation is requested.

This is evidence of a particular allocation, **not** an endorsement, payout guarantee, or liquidity lock. Unpublishing removes Claire's public listing/proof access; it does not hide on-chain addresses, transfers, or schedules.

Beneficiaries claim at `/vesting/<chainId>/claire-<lockId>` (`revenue-<lockId>` or `price-<lockId>` for those lock types): a signed-in user can connect a wallet and prepare a payout claim without joining the organization. Anyone may submit and pay the network gas, or call `claim` on the lock contract directly, but tokens go only to the beneficiary recorded on-chain. The claim pays what is available when it executes; the displayed amount may change. Claims have no Claire fee.

Vesting with time alone does not send tokens automatically. Check the transaction outcome before relying on a payout. These beneficiary payouts are distinct from [creator-fee figures](token.md#read-creator-fee-figures), which remain read-only in Claire.

## Claire protocol fees

> [!IMPORTANT]
> The Claire protocol's contracts are not deployed to any public network, so nothing below can be used today, and none of it is a promise of income or returns.

Every token launch through Claire goes through the workspace's own **fee router**. The router carries out the launch on pons v2 or Stockereum v3 and becomes the token's creator-fee recipient. There is no fee-free launch path through Claire. Launchpad settings that keep fees flowing to the router stay available, including the quote asset, tax rate, fee tier, initial buy and, on pons, the buyback. Stockereum's holder-reward mode is not available, because it would bypass the router. The **Creator fees** page shows the router's total revenue.

**Trading revenue** is everything the router claims from the launchpad's fee escrow. That includes project tax and the creator's base trading fees, and covers curve sweeps, the graduation credit and later pool sweeps; on pons with buyback on it also includes the launch tokens the buyback vests to the router. Trading volume, upstream platform and liquidity fees, gas and anything sent straight to the router are not trading revenue and are never charged. Each payout asset is split separately and paid in that asset, with no swap:

- **Claire takes 10%** of trading revenue, deducted from the creator's share and split evenly between the Claire treasury and $CLAIRE holders.
- **Project holders** receive the share you set when you deploy the router, up to 90%. The share is fixed once the router is deployed.
- **The payee** receives the rest, including rounding remainders: the launcher, a vesting vault or a split, as chosen at launch.

| Per 100 units of trading revenue | Claire treasury | $CLAIRE holders | Payee (creator share) | Project holders |
| --- | --- | --- | --- | --- |
| Holder sharing off | 5 | 5 | 90 | 0 |
| Holder sharing at 50% | 5 | 5 | 40 | 50 |

**Service fees** are fixed amounts of one USD stablecoin per chain (USDG on Robinhood Chain, USDC on Ethereum), with no price oracle, so a depeg changes their real value but not the amount charged. You can pay them with ETH through the swap step above. Each fee is split evenly between the Claire treasury and $CLAIRE holders, and is separate from gas and launchpad fees:

- **Launch:** USD 10, taken by the router in the launch transaction and charged only if the launch succeeds.
- **Locking a token launched elsewhere:** USD 25 per funding transaction, however many beneficiaries. It is never a share of the locked tokens.
- **Locking a token launched through Claire:** free apart from gas. Eligibility comes from an on-chain registry that only Claire fee routers can write, for tokens they launched themselves. Importing or naming a token does not make it eligible.
- **Claims, unlocks, cancellations and transfers:** no Claire fee; gas still applies.

Before you sign, Claire shows the exact payment token and amount, the launchpad's own fees and a gas estimate.

When the paying organization was referred, a referral reward comes out of Claire's treasury half of a service fee, never out of trading revenue. Projects that launched through Claire can also choose to airdrop part of their token to $CLAIRE holders. Both are described in [$CLAIRE holders and referrals](../reference/claire-holders.md).

Limits to keep in mind:

- Project-holder payouts are distributed in rounds that the designated wallet publishes from Claire's finalized holder index; see [Payout rounds](#payout-rounds). The contract does not check the snapshot itself: a round is only as correct as the balances it was built from, which the [verification guide](../reference/verify-on-chain.md) lets you compare with the chain.
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

## Price-target locks

A **price-target lock** holds tokens of a token launched through Claire and releases them in tranches as the token's market price holds above targets. It needs the [protocol](#claire-protocol-fees) like every Claire lock.

In **Vesting → New lock**, **Unlock by** offers **Dates**, **Revenue milestones** or **Price targets**. Price targets appear only for a token launched through Claire. The Options step is skipped: the lock is always noncancelable and nontransferable.

- **Targets:** 1 to 10 rows, each a price per token in the quote asset (not in USD) and an **Unlocks %** share. Prices strictly increase, the shares add up to 100%, and the first target must be above the highest price the token has already sustained.
- **Fallback date:** mandatory, in UTC and in the future. From that date everything is unlocked whatever the price.
- **Beneficiaries:** up to 100 per funding transaction, all on the same targets and fallback date.
- **Rules:** only tokens launched through Claire can be locked, there is no Claire fee, and a lock can be neither canceled nor transferred.

**How a target is reached.** The price is sampled on-chain whenever anyone updates it. Each hour keeps its lowest sample, and a target is reached once the lowest hourly value over the last **24 completed hours** is at or above it. Only completed hours count, and every one of the 24 needs at least one sample. Once reached, a target stays unlocked for good.

**Anyone can update the price.** The public **Update price** link on lock cards and the claim page prepares the update; any wallet can send it, with only gas to pay, and no organization is needed. A later update in the same hour lowers that hour's minimum if the price is lower, so an update at the real price corrects an inflated sample. The price comes from the launchpad: before graduation pons' bonding curve, after graduation the Uniswap v4 pool pons registered for the token, and for Stockereum its pool.

> [!WARNING]
> **A sampled-price trigger, not an oracle.** The price is a spot read. A trader who can move the market for one transaction can raise the price, update it and unwind, and an hour with no honest update can carry that manipulated sample. Nothing forces anyone to update the price. Moving the price costs the capital the trade needs plus round-trip fees, repeated for each of the 24 hours, but set targets with this in mind: only the fallback date guarantees an unlock.

The proof page shows the highest price held for 24 hours against each target and its share, the last sample and its age, the window's lowest sample and the fallback date. The tokens move only through the lock's `claim`, which pays the beneficiary. See the [contract reference](../reference/protocol-contracts.md#clairepricelock) and [Verify on-chain](../reference/verify-on-chain.md#verify-a-price-lock) to check a lock yourself.

## Payout rounds

Project-holder distributions, $CLAIRE holder distributions, airdrops and referral rewards all use the same cumulative rounds.

- **Cumulative:** each round publishes a new root for one asset in which every account's entry is its running total. A claim pays what you are owed minus what you already received, so **Claim everything owed** collects every round for an asset in one transaction, whenever you like. Rounds still publish on their schedule; a missed claim loses nothing, except on an expiring airdrop.
- **Funded or from held funds:** a round that has funds to share (project holders, $CLAIRE holders) publishes over what the distributor already holds; airdrop and referral rounds fund the increase and publish in one transaction. A round can never promise more than the distributor holds.
- **Airdrop expiry:** an airdrop distributor is deployed with a **Claims close (UTC)** date (at least 7 days out; the default is 90). Claims close at that date and the designated wallet can **Reclaim unclaimed tokens**. The airdrop page, its public proof and the claim page state the date.
- **Manifest version 2:** every round has a manifest that lists every account's amount for this round and its cumulative total and chains to the previous round's manifest. Its keccak-256 is the round's on-chain evidence, so [anyone can verify](../reference/verify-on-chain.md#the-round-manifest) the amounts, the continuity between rounds and the completeness of the holder list.

Holders claim at `/distributions/<chainId>/<distributor>`; the claim page shows each asset's rounds, what is promised in total and claimed, and what each connected wallet is owed.

## Claire Proof

Every supported token has a public **Claire Proof** page at `/proof/<chainId>/<token>`. It needs no sign-in, and it resolves for any ERC-20 on a supported network, not only tokens launched through Claire. Its open-graph image and the badge below use the same data.

> [!NOTE]
> **Evidence, not endorsement.** The page states what the chain and Claire's records show. It says nothing about the token's value, the project's intentions or what happens next, and it is not an audit or a liquidity-lock guarantee.

**What it shows.** The header names the token and network and reads **Launched through Claire** or **Not launched through Claire**. Then:

- **Locked share:** the percentage of total supply held by the Claire time, revenue and price lock contracts, with the amounts, read in one call at one stated block. It counts every token those contracts hold for this token, including vested but unclaimed tokens and locks the project has not published. These are token allocations, not liquidity locks.
- **Launch** (Claire-launched tokens only): the router, the launchpad, who receives the creator share (the creator's wallet, a Claire vesting vault, a Claire split, or a contract Claire's vault factory did not make), the holder share, the buyback state on pons, and the **fee recipient**. The fee recipient is re-read on every load: the page says whether the Claire router is the launchpad's recipient with no change pending, or shows a warning when a change is pending or the launchpad pays someone else.
- **Locked supply:** time, revenue and price lock amounts, each linked to its contract on the explorer; whether the opening buy was locked (from the confirmed launch receipt, with a link to the lock); the supply pons' locker holds on pons; and links to each lock the project has published.
- **Revenue** (Claire-launched tokens only): per asset, what the router has counted as revenue on-chain and the cumulative total confirmed holder rounds have published to holders, with each round's manifest and transaction. A manifest's keccak-256 is the round's on-chain evidence.
- **Verified connections:** the X account, Telegram chat and domain the project connected inside Claire. These are made in Claire, are not on-chain facts and do not show who controls the token.
- **Verify it yourself:** a copyable `@tryclaire/sdk/protocol` snippet that reads the same facts from the chain, and a link to [Verify on-chain](../reference/verify-on-chain.md). Take contract addresses from the SDK's `deployments` map, never from the page.

For a token that is not registered by a Claire router factory the page states nothing about its launch, fee routing or revenue, and shows only its Claire locks. If the chain cannot be read, the page says so instead of showing figures.

**Badge and sharing.** `/proof/<chainId>/<token>/badge.svg` is a small static dark badge (320 px wide, no script or fonts) showing **Launched via Claire** (Yes or No), **Locked by Claire locks** (a percentage) and, for Claire-launched tokens, **Revenue routed**. It is cached for about five minutes. The proof page's **Share this proof** card shows it with copy buttons for these snippets (shown with a placeholder URL):

```text
[![Claire Proof for SYMBOL](https://<claire-app>/proof/<chainId>/<token>/badge.svg)](https://<claire-app>/proof/<chainId>/<token>)
<a href="https://<claire-app>/proof/<chainId>/<token>"><img src="https://<claire-app>/proof/<chainId>/<token>/badge.svg" alt="Claire Proof for SYMBOL" width="320"></a>
```

On the **Token** page, everyone sees a **Claire Proof** card that opens the public page, and owners and admins also see a **Share proof** card that opens the badge with the Markdown and HTML snippets.

The same facts are available to an agent or script through the [developer API and MCP](../reference/developer-api.md#read-the-claire-proof).
