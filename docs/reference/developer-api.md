---
title: Developer API
order: 11
---

# Developer API

Use workspace-scoped read keys to retrieve permitted collected data. The API cannot publish content or send messages.

## Create a key

1. In Organization › Developers, an owner or admin issues a named API key for one workspace.
2. Choose its read scopes and an expiry of 7, 30, or 90 days.
3. Copy the secret when it appears. Claire stores a hash, not a reusable copy. You can revoke the key later.

A key stops working if its issuing user loses owner or admin membership. Keep it in your agent's secret store, not in a repository.

## Read workspace data

Use `/api/v1` with a bearer key. Depending on scopes, the API exposes workspace context, Knowledge search and source detail, asset metadata, linked Telegram chats and stored messages, stored X mentions, and stored token observations. Private material requires its specific read scope.

The API does not supply private file contents, publish content, send Telegram messages, or write to X. Responses expose collection state and timestamps; response time alone is not a freshness claim.

## Find request details

See the [API reference](https://app.tryclaire.net/developers), [OpenAPI definition](https://app.tryclaire.net/api/v1/openapi.json), and [downloadable agent skill](https://app.tryclaire.net/developers/skill.md) for request shapes and pagination. Requests are limited per key, workspace, and IP; see [current limits](index.md).
