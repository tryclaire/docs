---
title: Automations
order: 9
---

# Automations

Owners and admins can create explicitly enabled rules that use a source event or weekly schedule to take an action in a linked Telegram chat. Rules do not post to X.

## Choose a trigger

| Trigger | Event |
| --- | --- |
| Authored X activity | A post or reply from the connected X account, not an incoming mention. |
| Docs publication | A docs page's first publication. |
| Join portal | A join approved through the portal. |
| Weekly schedule | A scheduled rule trigger, not permission for Claire to write on X. |

## Choose an action

A rule can post plain text, post and pin a new message, or pin an existing message in a linked Telegram chat. Choose the destination chat and write the text yourself. The bot needs the relevant posting or pinning rights.

## Enable a rule

1. Choose the trigger and Telegram action, then save the rule.
2. Enable it explicitly. A disabled rule takes no live actions.

At delivery, Claire rechecks the rule, approving manager's role, connected account where applicable, and physical chat identity. Changing a rule or destination can stop pending work. Old events are not delivered late.

## Read run outcomes

| Outcome | Meaning |
| --- | --- |
| Delivered | The action was recorded as completed. |
| Failed | A definite failure occurred; eligible failed actions can be retried. |
| Skipped | The rule, permission, destination, or source no longer qualifies. |
| Unknown | Telegram may have completed an in-flight send. Check the chat. |

> [!IMPORTANT]
> Unknown is never retried automatically. Check the chat before taking another action.

A completed post is not posted again just because pinning it failed. Live delivery has an organization-wide hourly cap; see [current limits](../reference/index.md). See also [reports and notifications](reports-and-notifications.md).
