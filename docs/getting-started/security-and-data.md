---
title: Security and data
description: Access control, public surfaces and what Claire stores.
icon: lock
order: 3
---

# Security and data

Workspace content is available to authorized members, while sensitive management actions require owner or admin access. Public profiles, published docs, public asset URLs and published vesting proofs are separate public surfaces.

## Control workspace access

Only the owner can change another member's role or transfer ownership. Developer credentials belong to one workspace, have explicit read scopes and require the issuing manager to keep their role. The **Developers** page sets each key to API, MCP or both; pre-existing keys remain API-only. A source must be used (**Claire uses**) and separately approved for agents (**Agents read**, off by default) in **Knowledge**, in addition to matching scopes.

A Knowledge item's **public reference** classification does not publish it or grant public access. Unpublished docs drafts are private on the site, but **private/unpublished is not integration-private**: approving Agent access for Documents or Notes lets credentials with `knowledge:read` read private drafts or team notes, and agent providers may receive that content. Approving Telegram chats likewise lets credentials with `telegram:read` read stored conversations, including private linked groups or channels. External People reads still exclude private person notes. A file explicitly marked **public** in Assets has a public file URL; do not mark confidential files public. Relative images imported with GitHub docs are copied into public Assets.

Only an owner designates a [token signing wallet](../sources/token-actions/signing-wallet.md), separately for each chain. Owners and admins can prepare token actions and publish vesting links, but the designated wallet must sign organization transactions. Removing app access does not revoke wallet keys or on-chain rights.

Funding a lock exposes addresses, amounts, and its schedule on-chain even without a Claire proof page. Publishing additionally lists a public proof on the site; unpublishing does not make the underlying on-chain data private. A proof is not a liquidity lock or investment guarantee.

The official [`@tryclaire/sdk`](../api/index.md) is a REST client for scoped API keys, not an MCP client or an additional grant of access. [Native MCP](../mcp/index.md) uses its own method permission on a shared workspace credential. Keep keys out of browser bundles, public variables and source control. Installing the package does not connect a workspace or create a credential.

> [!WARNING]
> GitHub docs publish as soon as they sync, including docs from private repositories. See [Docs from GitHub](../publishing/github-docs.md) before syncing confidential material.

## Understand stored data

Claire retains connected source data and operational records. A linked Telegram chat's messages and activity are stored from the time the bot joins. Disconnecting a source does not automatically delete collected history. Turning a source off in Knowledge does not disconnect or delete it.

GitHub docs and team notes have different origins: edit synced docs at their repository source, while notes can be edited in Claire. Asset metadata does not mean Claire has indexed or read the asset's contents. External People reads expose only approved Telegram/X activity and platform identities, not Claire profiles, private person notes or live avatars.

## Know what Claire does not do

Claire does not write on X, generate replies or answers, approve its own publication of inferred project progress, custody funds, or claim creator fees. A wallet-signed beneficiary vesting claim is different from a creator-fee claim. An owner- or admin-authorized automation can post or pin supplied text in a Telegram chat; [review its delivery behavior](../automations/index.md) before enabling it.

## Find privacy information

Read the [privacy policy](https://tryclaire.net/privacy) for data categories, retention, and privacy requests. See [current limits](../reference/limits.md) for storage and API guards.
