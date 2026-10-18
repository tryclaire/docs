---
title: Context and search
description: List approved sources, read the context and search persisted content with bounded previews.
icon: search
order: 43
---

# Context and search

For Knowledge search, use an API-enabled key with `context:read` and `knowledge:read`, and turn on **Agents read** for the source. `context:read` alone does not expose any source. Set `CLAIRE_API_URL` to the API base URL shown under **Developers → Connect** (API), including `/api/v1`, and set `CLAIRE_API_KEY` in your secret environment:

```sh
curl --header "Authorization: Bearer $CLAIRE_API_KEY" \
  "$CLAIRE_API_URL/sources"
curl --get --header "Authorization: Bearer $CLAIRE_API_KEY" \
  --data-urlencode 'q=launch' "$CLAIRE_API_URL/search"
```

## Endpoints

`GET /api/v1/context` includes the credential's project ID and approved sources permitted by their matching read scopes; project identity fields and connection blocks may be absent when their sources are filtered. `GET /api/v1/sources` lists approved, included sources with matching read scopes, status and timestamps. `GET /api/v1/search` accepts `q`, `source` (an ID from `/sources`), `after`, `before` and `limit` (maximum 50). Search results intersect `context:read` with the per-source read scopes; `context:read` alone does not expose Documents or Notes. Timestamps may include UTC offsets; `after` is inclusive and `before` is exclusive. `data.items` contain bounded previews and source IDs; `data.sources` describes permitted sources and `data.hasMore` indicates additional results or a bounded source pool, **not** complete provider history. Follow source links or scoped detail endpoints for evidence.
