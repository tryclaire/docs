---
title: Native MCP
description: Connect an MCP client over Streamable HTTP to read approved sources with a scoped key.
icon: plug
tab: Developers
order: 51
---

# Native MCP

**Developers → Connect** (MCP) shows a read-only [Streamable HTTP](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports) endpoint at `/api/mcp` on the app's origin. Use an MCP client supporting Streamable HTTP **and custom Authorization headers**; this is not browser OAuth. The [REST SDK](../api/index.md) does not implement MCP, and an API-only legacy key cannot connect.

## Set up

:::steps

### Create the key

An owner or admin enables **MCP** (or both API and MCP) for a workspace key on the **Developers** page, chooses read scopes and a 7-, 30- or 90-day expiry. Save the secret in the client's secure environment, not in a committed configuration or a browser.

### Approve the sources

In **Knowledge**, keep the needed sources on (**Claire uses**) and explicitly approve **Agents read** for each. Agent access starts off. Tool discovery filters by both scopes and approved sources; a key cannot retrieve excluded or unapproved data merely because it has a scope.

### Connect the client

Copy the server URL from **Developers → Connect** (MCP) into `CLAIRE_MCP_URL` in your client's launch environment. Set `CLAIRE_API_KEY` there to the shared credential's secret. For Cursor, add this to your private `~/.cursor/mcp.json`, then connect and discover tools:
:::

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

Cursor supports environment variables in both `url` and `headers`; see its [MCP configuration documentation](https://cursor.com/docs/mcp). Use the exact server URL shown in Developers → Connect for your deployment.

## Check initialization

The server accepts **POST** JSON-RPC requests. To check initialization directly (this does not retrieve data):

```sh
curl --fail-with-body --silent --show-error \
  -H "Authorization: Bearer $CLAIRE_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  --data '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"claire-check","version":"1.0.0"}}}' \
  "$CLAIRE_MCP_URL"
```

## Next steps

:::cards
::card[MCP tools]{href=tools.md icon=list}
The read-only tools by scope.
::card[Credentials and keys]{href=../api/authentication.md icon=key}
Create the shared credential.
:::
