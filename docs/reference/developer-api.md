---
title: Developer API and SDK
order: 11
---

# Developer API and SDK

Read permitted workspace data through the REST API or the official TypeScript and JavaScript SDK, [`@tryclaire/sdk`](https://www.npmjs.com/package/@tryclaire/sdk). Both use the same workspace-scoped keys and permissions. Neither can publish content or send messages.

## Create a key

1. In Organization › Developers, an owner or admin issues a named API key for one workspace.
2. Choose its read scopes and an expiry of 7, 30, or 90 days.
3. Copy the secret when it appears. Claire stores a hash, not a reusable copy. You can revoke the key later.

A key stops working if its issuing user loses owner or admin membership. Keep it in your server environment or agent's secret store, never in browser code, public environment variables, or a repository.

## Read workspace data

Use `/api/v1` with a bearer key. Depending on scopes, the API exposes workspace context, Knowledge search and source detail, asset metadata, linked Telegram chats and stored messages, stored X mentions, and stored token observations. Private material requires its specific read scope.

The API does not supply private file contents, publish content, send Telegram messages, or write to X. Responses expose collection state and timestamps; response time alone is not a freshness claim.

## Install the SDK

The SDK requires **Node.js 22 or newer and ESM**. It includes TypeScript declarations and has no runtime dependencies. Choose the command for your package manager:

```sh
npm install @tryclaire/sdk
pnpm add @tryclaire/sdk
yarn add @tryclaire/sdk
bun add @tryclaire/sdk
```

Package-manager choice does not change the supported runtime: use the SDK in a server, CLI, or agent process, not a browser bundle.

## Make your first SDK request

Create a key with `knowledge:read` and provide it as the `CLAIRE_API_KEY` environment variable. Save this example as `example.mjs`, then run `node example.mjs`:

```js
import { Claire } from "@tryclaire/sdk";

const apiKey = process.env.CLAIRE_API_KEY;
if (!apiKey) throw new Error("Set CLAIRE_API_KEY before running this example.");

const claire = new Claire({ apiKey });
const result = await claire.knowledge.list({ q: "getting started", page: 1 });

for (const item of result.data) {
  console.log(item.title, item.preview);
}
console.log(result.meta.freshness);
console.log(result.pagination.hasNextPage);
```

The key selects the workspace; you do not pass an organization ID to the client.

## SDK resources and scopes

| Method | Required scope |
| --- | --- |
| `claire.context.get()` | `context:read` |
| `claire.knowledge.list(query)` | `knowledge:read` |
| `claire.knowledge.get(id, query)` | `knowledge:read` |
| `claire.assets.list(query)` | `assets:read` |
| `claire.assets.get(id)` | `assets:read` |
| `claire.telegram.chats.list(query)` | `telegram:read` |
| `claire.telegram.messages.list(chatId, query)` | `telegram:read` |
| `claire.x.mentions.list(query)` | `x:read` |
| `claire.token.get()` | `token:read` |

Query arguments are optional. Use the Claire chat UUID from `telegram.chats.list()`, not Telegram's numeric chat ID. Pass Knowledge IDs, including their prefix, unchanged.

### Token identity

The next SDK contract adds `chainId`, `protocol`, `poolId`, and `pairedToken` inside `data.token`. These TypeScript fields are not in npm `0.1.0`; check the SDK release notes and hosted OpenAPI before relying on them. Ethereum availability is also rollout-gated.

Identify a token by **chain ID and contract address together**: Ethereum is `1`, Robinhood Chain is `4663`, and `protocol` is `pons` or `stockereum`. The token object is `null` when none is linked.

`pool` is a legacy V3 pool-address field; V4 launches use the zero address there. A non-null `poolId` is a Uniswap V4 pool identifier, **not** a contract address. `poolId` and `pairedToken` may be `null` when unavailable. These fields do not grant wallet access: the API and SDK still cannot launch, fund, claim, or sign transactions.

## Read responses and continue pagination

The SDK preserves the API's `data`, `meta.freshness`, and endpoint-specific `pagination`. It also exposes `http.requestId`, `http.etag`, and response headers. Timestamps stay strings, and raw token balances stay decimal strings to avoid losing precision.

- Knowledge, assets, chats, and mentions use one-based `page` numbers. Check `pagination.hasNextPage` before requesting the next page.
- Telegram messages use `pagination.nextBefore` as the next request's `before` value. Check `hasMore`; `searchLimited` means the search did not cover all retained history.
- Knowledge detail may contain only part of a document. Pass `data.contentRange.nextOffset` as the next `offset` until it is `null`. Offsets count JavaScript UTF-16 units.

Each SDK call makes one request. It does not automatically paginate, retry, or cache private responses. Stale, unavailable, and synthetic data remain labeled; a successful HTTP response does not mean a provider was refreshed.

## Handle errors and timeouts

HTTP failures throw `ClaireAPIError` with `status`, `code`, `requestId`, `headers`, and `retryAfterSeconds`. A 401 means the key is invalid, expired, revoked, or no longer eligible; a 403 means a scope is missing; a 429 means a quota was reached. Respect the retry delay rather than retrying immediately.

Malformed successful responses throw `ClaireResponseError`. Network failures, cancellation, and timeouts use native fetch errors. The default timeout is 30 seconds, including reading the response body. Set `timeoutMs` or pass an abort signal in the last argument:

```js
await claire.knowledge.list(
  { page: 1 },
  { signal: AbortSignal.timeout(5_000) },
);
```

See the [SDK usage guide](https://github.com/tryclaire/sdk#readme) for complete query options, error-handling examples, and configuration. The [SDK source](https://github.com/tryclaire/sdk) is MIT licensed; [release notes](https://github.com/tryclaire/sdk/releases) track version changes.

## Find request details

You can use the REST API directly without installing the SDK. See the [API reference](https://app.tryclaire.net/developers), [OpenAPI definition](https://app.tryclaire.net/api/v1/openapi.json), and [downloadable agent skill](https://app.tryclaire.net/developers/skill.md) for request shapes and pagination. The SDK uses the same limits per key, workspace, and IP; see [current limits](index.md).
