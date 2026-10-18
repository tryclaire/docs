---
title: Scopes and source sharing
description: What each read scope exposes, and why a source must also be used and approved for agents.
icon: shield
order: 42
---

# Scopes and source sharing

In **Knowledge**, the source must also be used (**Claire uses**) **and** explicitly approved (**Agents read**); approval defaults off. Existing keys receive no source data until an owner or admin approves the needed sources: lists may be empty and details may return 404. Neither a granted scope nor API/MCP method access alone exposes a source. See [Knowledge and Assets](../sources/context.md).

## Scopes

| Scope | Read access when its sources are externally approved |
| --- | --- |
| `context:read` | `/context`, `/sources`, `/search`: source discovery and bounded persisted search, intersected with each source's matching read scope. |
| `knowledge:read` | Canonical Knowledge search and bounded detail, subject to visibility and suppression. |
| `assets:read` | File and folder metadata, not private object keys, file content or signed URLs. |
| `telegram:read` | Linked chats, stored messages and Telegram-sourced People. |
| `x:read` | Stored mentions and X-sourced People. |
| `token:read` | Stored token identity and observations, plus the project's Claire locks, fee routers, distribution rounds and the token's Claire Proof. |

## Next steps

:::cards
::card[Credentials and keys]{href=authentication.md icon=key}
Create a key with only the scopes you need.
::card[Knowledge and Assets]{href=../sources/context.md icon=book}
Where the Claire uses and Agents read switches live.
:::
