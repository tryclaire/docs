---
title: Security and data
order: 13
---

# Security and data

Workspace content is available to authorized members, while sensitive management actions require owner or admin access. Public profiles, published docs, public asset URLs, published vesting proofs, and reports shared by link are separate public surfaces.

## Control workspace access

Only the owner can change another member's role or transfer ownership. Developer API keys belong to one workspace, have explicit read scopes, and require the issuing manager to keep their role.

A Knowledge item's **public reference** classification does not publish it or grant public access. A file explicitly marked **public** in Assets has a public file URL; do not mark confidential files public. Relative images imported with GitHub docs are copied into public Assets.

Only an owner designates a [token signing wallet](../sources/token-actions.md), separately for each chain. Owners and admins can prepare token actions and publish vesting links, but the designated wallet must sign organization transactions. Removing app access does not revoke wallet keys or on-chain rights.

Funding a vesting stream exposes addresses, amounts, and its schedule on-chain even without a Claire proof page. Publishing additionally lists a public proof on the site; unpublishing does not make the underlying on-chain data private. A proof is not an audit, liquidity lock, or investment guarantee.

The official [`@tryclaire/sdk`](developer-api.md) uses those same scoped keys; it does not grant additional access. Use it server-side and keep keys out of browser bundles, public environment variables, and source control. Installing the package does not connect a workspace or create a key.

> [!WARNING]
> GitHub docs publish as soon as they sync, including docs from private repositories. See [publishing](../publishing/index.md) before syncing confidential material.

## Understand stored data

Claire retains connected source data and operational records. A linked Telegram chat's messages and activity are stored from the time the bot joins. Disconnecting a source does not automatically delete collected history.

GitHub docs and team notes have different origins: edit synced docs at their repository source, while notes can be edited in Claire. Asset metadata does not mean Claire has indexed or read the asset's contents.

## Know what Claire does not do

Claire does not write on X, generate replies or answers, approve its own publication of inferred project progress, custody funds, or claim creator fees. A wallet-signed beneficiary vesting claim is different from a creator-fee claim. An owner- or admin-authorized automation can post or pin supplied text in a Telegram chat; [review its delivery behavior](../automations/index.md) before enabling it.

## Find privacy information

Read the [privacy policy](https://tryclaire.net/privacy) for data categories, retention, and privacy requests. See [current limits](index.md) for storage and API guards.
