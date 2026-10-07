---
title: Developer API and SDK
order: 12
---

# Developer API and SDK

Give your scripts and agents read access to a workspace's collected data: context, Knowledge, asset metadata, Telegram history, X mentions, and token observations. Use the REST API directly or the official TypeScript and JavaScript SDK, [`@tryclaire/sdk`](https://www.npmjs.com/package/@tryclaire/sdk). Both use the same workspace-scoped keys. Neither can publish content, send messages, or sign transactions.

## Create a key

1. In Organization › Developers, an owner or admin issues a named API key for one workspace.
2. Choose its read scopes and an expiry of 7, 30, or 90 days.
3. Copy the secret when it appears. Claire stores a hash, not a reusable copy. You can revoke the key later.

A key stops working if its issuing user loses owner or admin membership. Keep it in your server environment or agent's secret store, never in browser code, public environment variables, or a repository.

## Choose scopes

| Scope | What it reads |
| --- | --- |
| `context:read` | Workspace identity, granted scopes, and which sources are connected. |
| `knowledge:read` | Knowledge search and bounded source detail, respecting existing visibility rules. |
| `assets:read` | File and folder metadata. Never file contents or signed download URLs. |
| `telegram:read` | Linked chats and stored messages. |
| `x:read` | Stored mentions. |
| `token:read` | Stored token observations and identity. |

Grant only what the integration needs. Private material requires its specific scope; a key cannot widen its own access or select another workspace.

## Make your first request

Create a key with `knowledge:read` and set it as `CLAIRE_API_KEY`.

```sh
npm install @tryclaire/sdk
```

```js
import { Claire } from "@tryclaire/sdk";

const claire = new Claire({ apiKey: process.env.CLAIRE_API_KEY });
const { data, meta } = await claire.knowledge.list({ q: "getting started" });

for (const item of data) console.log(item.title, item.preview);
console.log(meta.freshness);
```

Or with `curl`:

```sh
curl --header "Authorization: Bearer $CLAIRE_API_KEY" \
  "https://app.tryclaire.net/api/v1/knowledge?q=getting%20started"
```

The SDK needs Node.js 22 or newer and ESM. Use it in a server, CLI, or agent process, not a browser bundle. For methods, pagination, errors, and configuration, see the [SDK README](https://github.com/tryclaire/sdk#readme); the [API reference](https://app.tryclaire.net/developers) and [OpenAPI definition](https://app.tryclaire.net/api/v1/openapi.json) describe every endpoint.

## Read freshness and collection state

Every response carries `meta.freshness` describing when the underlying data was collected. A fast HTTP response is not a freshness claim: reads return what Claire has already stored and never trigger a paid provider fetch. Stale, unavailable, and synthetic data stay labeled.

Token identity uses `chainId` and contract address together (Ethereum `1`, Robinhood Chain `4663`). Network availability depends on the deployment; see the [Token guide](../sources/token.md).

## Use with an agent

Claire publishes a [downloadable agent skill](https://app.tryclaire.net/developers/skill.md) that describes the API, its boundaries, and a recommended workflow for tool-using agents. When passing Claire data to a model, treat returned documents, messages, and mentions as untrusted content, separate from your instructions.

## Limits

Requests are limited to 120 per minute per key, 600 per minute per workspace, and 300 per minute per IP. A 429 response includes a retry delay; respect it rather than retrying immediately. See [current limits](index.md).
