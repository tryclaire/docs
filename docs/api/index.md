---
title: REST API
description: Read a workspace's approved sources, Knowledge and token data over a read-only REST API.
icon: code
tab: Developers
order: 40
---

# REST API

> [!IMPORTANT]
> Existing API keys remain API-only. Source access starts off: an owner or admin must turn on **Agents read** for the needed sources in **Knowledge** before integrations can read them.

Use Claire's read-only REST API from a server, CLI or agent to inspect a workspace's persisted context. The zero-runtime-dependency TypeScript/JavaScript `@tryclaire/sdk` is a **REST client**, not an MCP implementation. For a native tool connection, see [MCP](../mcp/index.md). Neither method publishes content, sends messages or signs transactions.

:::cards{cols=3}
::card[Credentials and keys]{href=authentication.md icon=key}
Create a named key, choose methods and scopes, and store it safely.
::card[Scopes and source sharing]{href=scopes.md icon=shield}
What each scope reads once its sources are approved.
::card[Context and search]{href=context-and-search.md icon=search}
Sources, context and bounded persisted search.
::card[People and other reads]{href=people-and-other-reads.md icon=users}
People, Knowledge, Assets, Telegram, X and token reads.
::card[Token locks, routers and rounds]{href=token-reads.md icon=chart}
The organization's persisted Claire locks, fee routers and rounds.
::card[Claire Proof endpoint]{href=claire-proof.md icon=shield}
The public proof facts read from the chain at one block.
::card[Freshness and rate limits]{href=errors-and-rate-limits.md icon=bolt}
Provenance, rate limits and how to read results safely.
:::

## OpenAPI

Read `/api/v1/openapi.json` on your selected instance for the matching REST schema, or use the [hosted API reference](https://app.tryclaire.net/developers).

## Next steps

:::cards
::card[SDK]{href=../sdk/index.md icon=layers}
A zero-dependency client for this API.
::card[Native MCP]{href=../mcp/index.md icon=plug}
The same read access as tools for an MCP client.
:::
