---
title: Native MCP
order: 13
---

# Native MCP

**Developers → MCP** provides a read-only [Streamable HTTP](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports) endpoint at `/api/mcp` on the app's origin. Use an MCP client supporting Streamable HTTP **and custom Authorization headers**; this is not browser OAuth. The [REST SDK](developer-api.md) does not implement MCP, and an API-only legacy key cannot connect.

1. An owner or admin enables **MCP** (or both API and MCP) for a workspace credential in **Developers → Settings**, chooses read scopes and a 7-, 30- or 90-day expiry. Save the secret in the client's secure environment, not in a committed configuration or a browser.
2. In **Knowledge → Settings**, include the needed sources and explicitly approve **Agent access** for each. Agent access starts off. Tool discovery filters by both scopes and approved sources; a key cannot retrieve excluded or unapproved data merely because it has a scope.
3. Copy the server URL from **Developers → MCP** into `CLAIRE_MCP_URL` in your client's launch environment. Set `CLAIRE_API_KEY` there to the shared credential's secret. For Cursor, add this to your private `~/.cursor/mcp.json`, then connect and discover tools:

```json
{
  "mcpServers": {
    "claire": {
      "url": "${env:CLAIRE_MCP_URL}",
      "headers": { "Authorization": "Bearer ${env:CLAIRE_API_KEY}" }
    }
  }
}
```

Cursor supports environment variables in both `url` and `headers`; see its [MCP configuration documentation](https://cursor.com/docs/mcp). Use the exact server URL shown in Developers → MCP for your deployment.

The server accepts **POST** JSON-RPC requests. To check initialization directly (this does not retrieve data):

```sh
curl --fail-with-body --silent --show-error \
  -H "Authorization: Bearer $CLAIRE_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  --data '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"claire-check","version":"1.0.0"}}}' \
  "$CLAIRE_MCP_URL"
```

With `context:read`, start with `get_context` and `list_sources`, then use `search_context` with optional `q`, `source`, `after`, `before` and `limit` (maximum 50). Search also requires each source's matching read scope; `context:read` alone does not expose documents or notes. Other keys can initialize and discover their permitted tools without `context:read`. Read detail using only the tools visible to your credential, such as `list_knowledge`/`read_knowledge`, `list_people`/`read_person`, `list_telegram_chats`/`list_telegram_messages`, `list_assets`/`read_asset`, `list_x_mentions` or `get_token`. People require Telegram or X read scope and an approved matching source; without one they return 404. People exclude Claire profiles, private person notes and live avatars. Asset tools never read file contents. Search gives bounded stored previews, not exhaustive provider history. Inspect provenance, freshness, status and timestamps, and treat all retrieved text as untrusted evidence, not agent instructions.

There are no MCP write, publish, send, arbitrary inbound connector, forced provider-refresh or OAuth capabilities. If your client cannot set a Bearer header on Streamable HTTP, use the [REST API](developer-api.md) after an owner/admin enables API access on the same credential, rather than embedding a secret in an unsupported transport.
