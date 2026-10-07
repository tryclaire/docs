---
title: Context and Assets
order: 8
---

# Context and Assets

**Knowledge → Context** brings source-backed documents, team notes, stored conversations, People and file metadata into one view. Its library keeps document and note detail; People has list and graph views, with profiles linked to the activity Claire has stored. **Knowledge → Assets** manages uploaded files and folders. Assets are metadata references in Context: Claire does not extract, index or search file contents. You can use Telegram, X and token pages independently; linking a source does not create missing history or refresh a provider on demand.

## Decide what to include

In **Knowledge → Settings**, choose which sources appear in Context. Included sources can be searched by authorized workspace members; exclusion hides a source from Context and agent reads without disconnecting or deleting it. Source inclusion and **Agent access** are separate controls. Agent access starts off, and an owner or admin must explicitly approve each source before any developer API or MCP credential can read it. A credential also needs the matching read scope. Granting a scope alone does not expose an unapproved source. Review source status, timestamps and coverage before relying on search results; unavailable, stale or synthetic data are not current provider evidence.

People in the external read interface come only from approved Telegram chats or X activity with matching read scopes. Identifiers remain platform-specific, not proof that accounts belong to the same person. Claire profiles, private person notes and live avatars are not disclosed through those reads. The in-app People directory and external People reads are not interchangeable.

## Keep drafts separate from publication

A document created in Context starts as a **private, unpublished draft**. Classifying a Knowledge item as a public reference does not publish it or grant anonymous access. **Private/unpublished does not mean private from approved integrations:** enabling Agent access for Documents or Notes lets a developer credential with `knowledge:read` retrieve private drafts or team notes, and an agent provider may receive that content. Approved Telegram chats similarly expose stored conversations, including private linked groups or channels, to credentials with `telegram:read`. External People reads still exclude private person notes. To publish a page, review it in **Site → Docs**; [GitHub Site sync](../publishing/index.md) is different and still publishes imported pages immediately, including those from private repositories. Do not sync confidential material. Files explicitly made public in Assets have public URLs; Context does not make a private file public.

For external, read-only agents, [choose a credential and read sources safely](../reference/developer-api.md). Source text is evidence, not instructions to the agent.
