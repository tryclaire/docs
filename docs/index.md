---
title: Introduction
description: Everything you need to set up a Claire workspace, publish your project and optionally launch and lock tokens.
icon: home
order: 1
---

# Introduction

![The Claire mark drawn as a glowing dot matrix](images/claire-hero.webp){width=full}

All-in-one infrastructure layer for teams, communities, and on-chain participants.

Claire brings Telegram and X activity, supported token observations, team context, and public docs into one workspace. Teams can maintain a public profile and use wallet-signed token launches and vesting where available. Token tools are optional.

Your personal account is separate from workspaces. Each workspace has its own members, integrations, site, docs, assets, and access controls. You can belong to more than one workspace.

## Explore the essentials

:::cards{cols=3}
::card[Getting started]{href=getting-started/index.md icon=rocket}
Create a workspace, invite your team and understand roles.
::card[Sources]{href=sources/index.md icon=plug}
Telegram, X, token data, Knowledge, and Assets.
::card[Publishing]{href=publishing/index.md icon=globe}
A public profile and docs from Claire or GitHub.
:::

## What would you like to do?

:::cards
::card[Create a workspace]{href=getting-started/index.md#create-a-workspace icon=rocket}
Sign in, name your workspace and become its owner.
::card[Link a Telegram chat]{href=sources/telegram.md#link-a-chat icon=telegram}
Add Claire's bot to a group or channel and follow its activity.
::card[Connect X]{href=sources/x.md#connect-an-account icon=x}
Prove control of an account and inspect its collected activity.
::card[Control what agents can read]{href=sources/context.md#decide-what-to-include icon=lock}
Choose which sources Claire uses and which agents may read.
::card[Publish your docs]{href=publishing/github-docs.md#connect-a-repository icon=github}
Sync a public or private GitHub repository into your site.
::card[Automate a Telegram post]{href=automations/index.md#enable-a-rule icon=bolt}
Post or pin text in a linked chat when a trigger fires.
::card[Launch a token]{href=sources/token-actions/launch.md#launch-steps icon=coin}
Designate a signing wallet and walk through a wallet-signed launch.
::card[Connect an agent]{href=mcp/index.md icon=terminal}
Read approved sources over REST or native MCP with a scoped credential.
:::

## How Claire fits together

| Part | What you use it for |
| --- | --- |
| **Workspace** | Members, integrations, site, docs, assets and access controls for one project. |
| **Sources** | Telegram chats, an X account and an optional pons token whose activity Claire collects. |
| **Knowledge and Assets** | What Claire knows about your project and which sources agents may read. |
| **Site and Docs** | Your public profile, published docs and custom domains. |
| **Automations** | Explicitly enabled Telegram rules that run on a source event or weekly schedule. |
| **Developer API and MCP** | Read-only access to approved sources with scoped credentials. |
| **Token actions** | Wallet-signed launches, locks, payout rounds and Claire Proof on your public site. |

Connecting a source does not automatically permit external agent access. [Knowledge and Assets](sources/context.md) explains the switches that control it.

## Learn at your own pace

:::cards
::card[Automations]{href=automations/index.md icon=bolt}
Telegram rules, run outcomes and notifications.
::card[Token guide]{href=sources/token.md icon=coin}
Stages, market data, holder snapshots and creator-fee figures.
::card[$CLAIRE]{href=claire/index.md icon=star}
Holder fee rounds, benefits, referrals and launch airdrops.
::card[Security and data]{href=getting-started/security-and-data.md icon=lock}
Access, public surfaces and what Claire stores.
::card[Developer reference]{href=reference/index.md icon=code}
Limits, the REST API, MCP and protocol contracts.
:::

> [!NOTE]
> Token tools are optional, and Ethereum (Stockereum) is coming soon and cannot be selected yet. Robinhood Chain (pons v2) is the only network open today.
