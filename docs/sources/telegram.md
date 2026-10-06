---
title: Telegram
order: 4
---

# Telegram

Link a group or channel to inspect recorded messages, people, and chat activity. Private one-to-one chats cannot be linked as workspace chats.

## Link a chat

1. Add Claire's bot to your group or channel as an administrator.
2. If the Telegram account that added the bot is linked to a Claire user managing one workspace, Claire links the chat to it. If that user manages several, choose the workspace when the bot asks.
3. Otherwise, generate a link code in Organization settings and paste `/link claire-XXXXXX` in the chat as a chat admin. Codes expire after 10 minutes.

## Understand collected data

Collection starts when the bot is added; it cannot fetch earlier chat history. Claire stores message text and captions, senders, timestamps, edits, reply references, and attachment identifiers and metadata. Joins and leaves contribute to chat activity.

> [!IMPORTANT]
> Removing a message in Telegram does not automatically erase Claire's stored copy.

## Set up the join portal

1. Open a linked chat's Settings and enable the join portal.
2. Configure the group to require approval and grant the bot permission to approve join requests.
3. A requester completes a human check in a Telegram Mini App. Claire verifies Telegram's signed data and the check before approving or declining. Review outcomes in the chat's settings and insights.

If the portal is not enabled, Telegram's human admins retain control of requests. The bot's portal messages concern verification and the request outcome; it does not publish messages on behalf of a requester. [Automations](../automations/index.md) are separate, explicitly enabled rules that can post or pin in a linked chat.
