---
title: Limits and freshness
description: Current application guards and early-access limits, and how to read collected data.
icon: list
order: 34
---

# Limits and freshness

These are current application guards and early-access limits, not proposed pricing. Early access applies to every workspace today; the top plan raises some limits (see [$CLAIRE holder benefits](../claire/holder-benefits.md)). A provider can impose separate limits.

## Current limits

| Feature | Current application limit |
| --- | --- |
| Workspace creation | 5 requests per account per day. |
| Invitations | 20 requests per workspace per hour; invitation links expire in 7 days. |
| Assets | 2 GiB of workspace storage (10 GiB on the top plan); 50 MiB per file; 60 upload requests per workspace per hour. |
| Image upload | 5 MiB per image. |
| X collection | 100,000 search credits per connected X account per UTC month. |
| Holder snapshot export | Up to 10,000 holder rows in the full response; `truncated` signals more matches. |
| Developer API | 120 requests per minute per key and 600 per minute per workspace (360 and 1,800 on the top plan), and 300 per minute per IP. `RateLimit-Limit` reports the limit that applies. |

## Check data freshness

Limits do not guarantee that an integration is currently connected or collected data is complete. Check each integration's connection, error, and collection status.
