---
title: People and other reads
description: People endpoints plus the scoped reads for Knowledge, Assets, Telegram, X and token.
icon: users
order: 44
---

# People and other reads

## People

`GET /api/v1/people?q=…&page=1` and `GET /api/v1/people/{key}` require `telegram:read` **or** `x:read` plus an approved matching source. If no approved source matches the key's scopes, these endpoints return 404; a person not visible through the approved sources also returns 404. Use a key returned by the list endpoint. The list returns 50 people per page; `pagination.searchLimited` signals that the People search pool was capped, so pages need not cover all stored activity. These reads use platform-specific identities and persisted activity only: no Claire profiles, private person notes, merged cross-platform identities or live avatars.

## Other scoped reads

Existing scoped endpoints for Knowledge, Assets, Telegram, X and token remain available, now subject to the same source policy. Asset reads return metadata, not file contents. API requests never force provider collection.

## Next steps

:::cards
::card[Token locks, routers and rounds]{href=token-reads.md icon=chart}
The token-scoped reads.
::card[Claire Proof endpoint]{href=claire-proof.md icon=shield}
Proof facts read from the chain.
:::
