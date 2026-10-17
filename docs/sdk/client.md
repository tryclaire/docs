---
title: Use the client
description: Create the client and call sources, search and People.
icon: code
order: 49
---

# Use the client

The client includes `claire.sources.list()`, `claire.search(query)`, `claire.people.list(query)` and `claire.people.get(key)`. The `@tryclaire/sdk/protocol` subpath [verifies launches, locks, payees and rounds on-chain](../verification/index.md); it needs the optional `viem` peer dependency, and the root client stays dependency-free.

```js
import { Claire } from "@tryclaire/sdk";

const claire = new Claire({
  apiKey: process.env.CLAIRE_API_KEY,
  baseUrl: process.env.CLAIRE_API_URL,
});
const { data: sources } = await claire.sources.list();
const { data: results, meta } = await claire.search({ q: "launch", limit: 20 });
// People additionally needs Telegram or X scope and an approved matching source.
const { data: people } = await claire.people.list({ q: "alice" });
if (typeof people[0]?.key === "string") console.log(await claire.people.get(people[0].key));
console.log(sources, results.items, results.hasMore, meta.freshness);
```

## Check the schema

Use Node.js 22 or newer with ESM. See the [SDK README](https://github.com/tryclaire/sdk#readme) for methods, pagination and configuration, and check the installed package version before using new methods. Read `/api/v1/openapi.json` on your selected instance for the matching REST schema, or use the [hosted API reference](https://app.tryclaire.net/developers).
