---
title: Knowledge and Assets
description: Organize Knowledge and Assets and control which sources agents can read.
icon: book
order: 19
---

# Knowledge and Assets

**Knowledge** is what Claire knows about your project, in two parts. **Connections** fills itself from your sources: documents, files, the project profile, the token, X and each linked Telegram chat, each with its status, item count and last update. **Notes** are what your team writes by hand; any member can write, edit and archive a note, and owners and admins can also delete one. One search covers both, including stored conversations, X posts and People. **People** lists the people behind your chats and X activity, with list and graph views and profiles linked to the activity Claire has stored. **Assets** manages uploaded files and folders. Files appear in Knowledge as metadata only: Claire does not extract, index or search file contents. You can use Telegram, X and token pages independently; linking a source does not create missing history or refresh a provider on demand.

## Decide what to include

Each source in **Knowledge** has two switches: **Claire uses** and **Agents read**. Notes have the same two switches at the bottom of their list. Sources Claire uses can be searched by authorized workspace members; turning a source off hides it from Knowledge and agent reads without disconnecting or deleting it. The two switches are separate. **Agents read** starts off, and an owner or admin must explicitly approve each source, after a confirmation, before any developer API or MCP credential can read it. A credential also needs the matching read scope. Granting a scope alone does not expose an unapproved source. Review source status and timestamps before relying on search results; unavailable, stale or synthetic data are not current provider evidence.

Knowledge and the **Developers** page both show how often agents read the workspace over the last 30 days, split between MCP and the API, with the number of active keys and the latest read.

People in the external read interface come only from approved Telegram chats or X activity with matching read scopes. Identifiers remain platform-specific, not proof that accounts belong to the same person. Claire profiles, private person notes and live avatars are not disclosed through those reads. The in-app People directory and external People reads are not interchangeable.

## Keep drafts separate from publication

A docs page stays a **private, unpublished draft** until it is published in **Docs**. Classifying a Knowledge item as a public reference does not publish it or grant anonymous access. **Private/unpublished does not mean private from approved integrations:** turning on **Agents read** for Documents or Notes lets a developer credential with `knowledge:read` retrieve private drafts or team notes, and an agent provider may receive that content. Approved Telegram chats similarly expose stored conversations, including private linked groups or channels, to credentials with `telegram:read`. External People reads still exclude private person notes. To publish a page, review it in **Docs**; [GitHub Site sync](../publishing/github-docs.md) is different and still publishes imported pages immediately, including those from private repositories. Do not sync confidential material. Files explicitly made public in Assets have public URLs; Knowledge does not make a private file public.

For external, read-only agents, [choose a credential and read sources safely](../api/index.md). Source text is evidence, not instructions to the agent.
