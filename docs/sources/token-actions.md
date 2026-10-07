---
title: Token actions
order: 7
---

# Token actions

Use **Token actions** in your organization's Token area to designate a signing wallet, launch a supported token, and fund or publish a vesting allocation. Robinhood Chain uses pons v2; Ethereum uses Stockereum v3. Both networks require ETH for gas. Token tools are optional.

> [!IMPORTANT]
> Ethereum/Stockereum availability is rollout-gated. Confirm the network and available actions in Claire before funding a wallet or promising a launch.

## Verify the organization's wallet

1. Select the network and connect the wallet that will sign. Each chain has its own designated wallet.
2. An **organization owner** signs a short-lived verification challenge to prove control. This verifies the designation; it does not transfer funds or give Claire spending authority. Only the owner can designate or remove the wallet.
3. Owners and admins can prepare launches and locks, but the **designated wallet must sign**. Being an admin does not give someone another person's wallet keys. Members cannot manage launches or vesting allocations.

Removing the designation or a member does not revoke wallet keys, on-chain rights, or previously executed transactions. Claire records intent and verified chain outcomes, not private keys. It does not custody funds, sponsor gas, or sign transactions on your behalf.

## Launch and link a token

1. Enter launch details on the chosen network. Robinhood pons v2 uses native ETH and offers a creator tax. Stockereum v3 uses an enabled quote, a permitted swap fee, and a permanent choice of creator or holder-reward routing. Review the live factory settings and costs. An optional initial buy, where available, spends wallet ETH.
2. Select **Prepare launch**. Review the network, wallet, destination contract, calldata, ETH value, nonce, and costs before signing. Preparing is not submission; submission is not confirmation.
3. Check **Transaction history and recovery** until the transaction is verified. Use **Refresh** or attach the known transaction hash if submission is uncertain. **Do not resend** an uncertain transaction or abandon it unless you know it was never sent. Confirmations reduce, but do not eliminate, reorganization risk.
4. A verified launch is linked automatically only if the initiating user still has owner/admin access, the wallet designation is unchanged, and no different token is linked. A confirmed transaction can remain unassociated if those checks fail; read its status instead of launching again.

To link an existing supported token, use **Organization → Connections**, select its network and enter its contract address. Claire verifies the chain, factory, and designated wallet requirements. One workspace has one active linked token; resolve its existing link before starting a different launch.

The protocols have different economics. Stock-linked assets also involve issuer, oracle, market, and securities-compliance risks. See the [Token guide](token.md) before interpreting market or creator-fee figures.

## Fund a vesting allocation

Vesting requires a linked supported pons v2 or Stockereum v3 token launched by that chain's designated wallet. Enter the beneficiary address, exact token amount, and UTC schedule. Claire uses **Sablier Lockup v4**:

- **Timelock:** the full amount becomes claimable at the end.
- **Linear:** tokens become claimable progressively between start and end.
- **Catch-up cliff:** nothing is claimable before the cliff; the fraction accrued since the start unlocks at the cliff, then vesting continues linearly.

Allocations are **noncancelable and nontransferable**. Verify the beneficiary, amount, and dates carefully before funding.

1. Prepare and sign the exact ERC-20 approval from the designated wallet, unless sufficient allowance is already available. Approval grants the Sablier contract allowance; it does not fund a stream. Wait for confirmation.
2. Separately prepare, review, sign, and confirm the funding transaction, which deposits the tokens into Sablier.
3. Check the recorded outcome. Approval and funding each need gas. Review the destination, calldata, value, and nonce each time, and use the same recovery procedure if submission is uncertain.

## Publish proof and claim payouts

After funding is verified and associated with the workspace, an owner or admin can **Publish** the lock. The organization site links to `/locks/<chainId>/<streamId>`, where anyone can inspect the beneficiary, schedule, contract, funding transaction, and on-chain locked, claimable, and withdrawn amounts.

This is evidence of a particular allocation, **not** an audit, endorsement, payout guarantee, or liquidity lock. Unpublishing removes Claire's public listing/proof access; it does not hide on-chain addresses, transfers, or schedules.

At `/vesting/<chainId>/<streamId>`, a signed-in user can connect a wallet and prepare a beneficiary payout claim without joining the organization. Anyone may submit and pay the network gas and quoted Sablier withdrawal fee, but tokens go only to the beneficiary recorded on-chain. The claim withdraws what is available when it executes; the displayed amount may change.

Vesting with time alone does not send tokens automatically. Check the transaction outcome before relying on a payout. These beneficiary payouts are distinct from [creator-fee figures](token.md#read-creator-fee-figures), which remain read-only in Claire.
