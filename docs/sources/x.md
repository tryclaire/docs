---
title: X
description: Connect an X account to inspect its collected activity, read-only.
icon: x
order: 6
---

# X

Connect an X account to inspect its collected activity. The integration is read-only.

## Connect an account

An owner or admin signs in through the workspace's X integration to prove control of the account. Claire requests `users.read` and `tweet.read`, reads the account identity, then attempts to revoke the temporary OAuth token. It stores account identification, not that token.

## Inspect activity and freshness

**Social** displays the connected profile, recent authored posts and replies, post engagement, follower snapshots, the people who mention you most, and collected mentions. Its **Mentions** view reads stored collection results, and **Needs reply** lists stored mentions that none of your recent posts answer. Check the account's collection status and the last successful update to see whether the view is current.

Public search and indexing can lag, so a mention may not appear immediately or at all.

## Understand read-only access

Connecting an account does not give Claire permission to publish posts, replies, or direct messages on X. [Automations](../automations/index.md) can use authored X posts or replies as a trigger for a Telegram action, not an X action.
