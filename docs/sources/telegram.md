---
title: Telegram
description: Link a group or channel to follow its messages, people and activity, with an optional join portal.
icon: telegram
order: 5
---

# Telegram

Link a group or channel to follow its recorded messages, people, and chat activity in **Community**. Private one-to-one chats cannot be linked as workspace chats.

## Link a chat

1. Add Claire's bot to your group or channel as an administrator.
2. If the Telegram account that added the bot is linked to a Claire user managing one workspace, Claire links the chat to it. If that user manages several, choose the workspace when the bot asks.
3. Otherwise, select **Add a chat** (on Community before your first chat, or in **Settings → Connections**) and paste the `/link claire-XXXXXX` code it shows in the chat as a chat admin. Codes expire after 10 minutes.

## Follow your community

**Community** gathers every linked chat: a live feed of the newest messages across chats, the members, messages and joins of the last week, messages per day, the chats themselves and the most active people. Each chat has its own page with the full conversation, its figures, its most active people and new members. Select a person to see what Claire has stored about them. The feed and chat pages are read-only mirrors; reply in Telegram.

## Understand collected data

Collection starts when the bot is added; it cannot fetch earlier chat history. Claire stores message text and captions, senders, timestamps, edits, reply references, and attachment identifiers and metadata. Joins and leaves contribute to chat activity.

> [!IMPORTANT]
> Removing a message in Telegram does not automatically erase Claire's stored copy.

## Set up the join portal

1. On the chat's page, open **Portal** and turn it on (owners and admins), or use the portal switch in the chat's **Settings**.
2. Configure the group to require approval and grant the bot permission to approve join requests; the Portal dialog checks this live.
3. A requester completes a human check in a Telegram Mini App. Claire verifies Telegram's signed data and the check before approving or declining. Review outcomes, and approve or decline waiting requests, in the chat's Portal dialog.

If the portal is not enabled, Telegram's human admins retain control of requests. The bot's portal messages concern verification and the request outcome; it does not publish messages on behalf of a requester. [Automations](../automations/index.md) are separate, explicitly enabled rules that can post or pin in a linked chat.
