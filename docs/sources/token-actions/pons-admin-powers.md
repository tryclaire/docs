---
title: pons admin powers
description: The powers pons keeps for itself and how Claire warns you when a token's creator fees move.
icon: warning
order: 18
---

# pons admin powers

> [!WARNING]
> The Claire contracts cannot remove powers pons keeps for itself. pons' administration is a 2-of-3 Safe. Among its powers, pons can propose a different creator-fee recipient for a launch; the change is public and executes only after a 3-day timelock, and the Claire router cannot block it. A new recipient would bypass the router's split. pons also runs a fee-sweep operator, can disable a launch's buyback, and its fee escrow accepts credits from anyone.

## Fee-recipient monitoring

Claire re-reads the token's creator-fee recipient on every load of the token page. If pons now pays the token's creator fees to something other than its Claire fee router, or has proposed a change, the Token page and **Creator fees** show a warning: **This token's creator fees no longer go to its fee router**, or **pons has proposed moving this token's creator fees**, with the new recipient and the effective and expiry times in UTC. Check it before relying on the split.
