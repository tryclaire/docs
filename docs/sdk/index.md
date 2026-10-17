---
title: SDK
description: Install the zero-dependency TypeScript and JavaScript client for the read-only REST API.
icon: layers
tab: Developers
order: 48
---

# SDK

The zero-runtime-dependency TypeScript/JavaScript `@tryclaire/sdk` is a **REST client**, not an MCP implementation. For a native tool connection, see [MCP](../mcp/index.md). Neither method publishes content, sends messages or signs transactions.

## Install

```sh
npm install @tryclaire/sdk
```

Install 0.7.0 or later for the Claire protocol. Use Node.js 22 or newer with ESM.

:::cards
::card[Use the client]{href=client.md icon=code}
Sources, search and People with the typed client.
::card[Protocol subpath]{href=protocol.md icon=link}
Verify launches, locks, payees and rounds on-chain.
:::

## README

See the [SDK README](https://github.com/tryclaire/sdk#readme) for methods, pagination and configuration, and check the installed package version before using new methods.
