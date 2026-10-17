---
title: Fee rules and trust
description: How trading revenue and service fees are split, and which roles can do what.
icon: receipt
order: 60
---

# Fee rules and trust

## Fee rules

Trading revenue `R` is everything a router claims from the launchpad's fee escrow, per asset, in that asset: the quote asset and, on pons with buyback on, the launch token the buyback vests to the router. `ClaireFeeRouter.split(R)` with `CLAIRE_SHARE_BPS = 1000`, `BPS = 10000` and the router's current `holderBps` (0 to 9000; the creator can raise it, never lower it):

```text
claire        = R * 1000 / 10000
projectHolder = R * holderBps / 10000
claireHolders = claire / 2
treasury      = claire - claireHolders
payee         = R - claire - projectHolder      (all rounding dust)
```

The split uses the `holderBps` and `payee` in effect when revenue is distributed. Fees the router has earned so far are harvested and distributed under the old values before a change takes effect, so each `Distributed` event follows one unambiguous split.

Claire's 10% applies to everything the router receives, including vested buyback tokens, and is deducted only from the creator's share. The quote that pons diverts to the buyback is never a router receipt, so it is never charged. Anything that does not arrive through the escrow claim (direct transfers, launch change, refunds) goes to the payee in full and is never charged. A permissionless credit to the router's pons escrow balance cannot be told apart from revenue and is treated as revenue. For a migrated token this holds only from [the adoption cutoff](router-and-factories.md#adoption-cutoff) on.

| Action | Fee |
| --- | --- |
| Launch through Claire | USD 10 stablecoin, half treasury and half $CLAIRE holders, only if the launch succeeds. |
| Bring an existing pons token to Claire (`adopt`) | USD 25 stablecoin (`migrationFee`), half treasury and half $CLAIRE holders, once, atomically with the adoption. |
| Lock of a token launched elsewhere | USD 25 per `createLocks` call, however many beneficiaries. |
| Lock of a token launched or adopted through Claire, including the opening-buy lock | None. |
| Revenue lock, price lock | None. |
| Vesting vault, split, their factory | None. |
| Claim, cancel, beneficiary transfer, release, airdrop and referral claims | Gas only. |

## Roles and trust

- **Router creator (launcher):** the only account that can launch or adopt through its router, switch its buyback, raise its holder share or propose a payee change. It can only raise the holder share, never lower it; a payee change takes 7 days after a public proposal and can be canceled until applied. It cannot lower Claire's 10%, move the launchpad's fee recipient or take the router out of Claire, and keeps no claim on revenue once a different payee is set.
- **Payee:** an account, or a vault or split that only ever pays its immutable beneficiary or payees. Anyone can trigger a release, and anyone can apply a payee change once its 7 days have passed.
- **Distributor publisher:** a project's designated wallet (or the party fixed when a $CLAIRE or referral distributor is deployed). It is trusted for the off-chain allocation of a round and for nothing else; on an airdrop distributor it can also reclaim what is left after `reclaimAfter`.
- **Launchpad powers:** pons v2 keeps controls of its own that the Claire contracts cannot remove. These include a 2-of-3 Safe admin, a creator-fee recipient change that can be proposed with a public 3-day timelock, a fee-sweep operator, and the power to disable a launch's buyback. They apply unchanged to a token migrated with `adopt`, which no Claire contract can undo or move back. Review the launchpad's current powers before launching or migrating through it.
