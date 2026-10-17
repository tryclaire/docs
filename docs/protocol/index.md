---
title: Protocol
description: The twelve Claire contracts, how they fit together and where to find their ABIs and addresses.
icon: file
tab: Developers
order: 53
---

# Protocol

The Claire protocol is twelve Solidity contracts. None has an owner, admin, pause, upgrade path or arbitrary call, and every parameter is fixed at deployment except two on each router, which only the router's creator can change: the holder share can only go up, and the payee changes only after 7 days' public notice. Nobody can leave Claire: no function moves a router's launchpad fee recipient. Contract names below are the Solidity names.

## How they fit together

| Contract | Created | Purpose |
| --- | --- | --- |
| `ClaireRouterFactory` | Once per chain | Deploys each launch's fee router and holder distributor at predictable addresses, and is the registry of Claire-launched tokens. |
| `ClaireRouterDeployer` | Once per chain | Holds the router's creation code and creates routers for the factory, so the factory stays under the contract size limit. |
| `ClaireFeeRouter` | Once per launch | The launch's only launcher and creator-fee recipient (or the adopter of an existing pons token). Splits the trading revenue it collects, including pons buyback tokens. |
| `ClaireDistributor` | Per recipient group | Pays a group (project holders, $CLAIRE holders, an airdrop, referrers) from cumulative Merkle roots. |
| `ClaireDistributorFactory` | Once per chain | Deploys distributors at CREATE2 addresses. |
| `ClaireTokenLock` | Once per chain | Timelock, linear and catch-up-cliff token locks, with notice-period cancel. |
| `ClaireRevenueLock` | Once per chain | Locks of Claire-launched tokens that unlock as revenue grows. |
| `ClairePriceLock` | Once per chain | Locks of Claire-launched tokens that unlock as a sampled market price holds. |
| `ClaireVestingVault` | Per payee | A payee that vests everything it receives to one beneficiary. |
| `ClaireSplit` | Per payee | A payee that divides everything it receives between 2 to 10 wallets. |
| `ClaireVaultFactory` | Once per chain | Deploys vaults and splits and records them, so a payee can be verified. |
| `ClaireProofView` | Once per chain | Stateless: one call returns a token's verifiable Claire facts. |

Fees are fixed amounts of one 6-decimal USD stablecoin per chain (`launchFee` 10, `migrationFee` 25 and `lockFee` 25, in whole units) plus a share of trading revenue. The stablecoin is assumed to hold its peg; there is no oracle.

:::cards{cols=3}
::card[Deployments and ABIs]{href=deployments.md icon=globe}
Where addresses and ABIs are published.
::card[Router and factories]{href=router-and-factories.md icon=flow}
The fee router, its factory and deployer.
::card[Distributors]{href=distributors.md icon=gift}
Cumulative roots for holders, airdrops and referrals.
::card[Locks]{href=locks.md icon=lock}
Time, revenue and price locks.
::card[Vaults and splits]{href=vaults-and-splits.md icon=users}
Payees that vest or divide what they receive.
::card[Proof view]{href=proof-view.md icon=shield}
One call that returns a token's Claire facts.
::card[Fee rules and trust]{href=fee-rules-and-trust.md icon=receipt}
How trading revenue is split and who can do what.
:::
