---
title: Reference and limits
order: 11
---

# Reference and limits

These are current application guards and early-access limits, not proposed pricing. Early access applies to every workspace today; the planned top plan raises some limits (see [$CLAIRE holders and referrals](claire-holders.md)). A provider can impose separate limits.

## Current limits

| Feature | Current application limit |
| --- | --- |
| Workspace creation | 5 requests per account per day. |
| Invitations | 20 requests per workspace per hour; invitation links expire in 7 days. |
| Assets | 2 GiB of workspace storage (10 GiB on the planned top plan); 50 MiB per file; 60 upload requests per workspace per hour. |
| Image upload | 5 MiB per image. |
| GitHub docs import | Up to 300 Markdown files from the selected folder per sync. |
| Automations | 10 unarchived rules per workspace (25 on the planned top plan); up to 30 Telegram action attempts per workspace per hour. |
| X automation collection | 100,000 search credits per connected X account per UTC month. |
| Holder snapshot export | Up to 10,000 holder rows in the full response; `truncated` signals more matches. |
| Developer API | 120 requests per minute per key and 600 per minute per workspace (360 and 1,800 on the planned top plan), and 300 per minute per IP. `RateLimit-Limit` reports the limit that applies. |

## Check data freshness

Limits do not guarantee that an integration is currently connected or collected data is complete. Check each integration's connection, error, and collection status.

## More reference

- [Developer REST API and SDK](developer-api.md): source-first reads, scopes, shared credentials, and SDK installation.
- [Native MCP](mcp.md): Streamable HTTP setup and read-only tools.
- [Security and data](security-and-data.md): access, public surfaces, private drafts and stored data.
- [$CLAIRE holders and referrals](claire-holders.md): planned holder benefits, referral rewards and launch airdrops.
