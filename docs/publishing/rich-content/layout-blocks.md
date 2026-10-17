---
title: Layout blocks
description: Collapsible sections, tabs, cards, steps and columns for scannable docs pages.
icon: layers
order: 25
---

# Layout blocks

Blocks that organize a page. Each block is a `:::` fence, and each separator is a `::` line.

## Collapsible sections

````markdown
:::details[Show the fine print]
Hidden until the reader expands it.
:::
````

## Tabs

````markdown
:::tabs
::tab[npm]
```sh
npm install @tryclaire/sdk
```
::tab[pnpm]
```sh
pnpm add @tryclaire/sdk
```
:::
````

Each `::tab[Label]` line starts a tab, and everything until the next one is its content. Tabs scroll sideways on narrow screens.

## Cards

````markdown
:::cards
::card[Token guide]{href=/docs/token icon=coin}
Market, holders and fees.
::card[Proof]{href=/docs/proof icon=shield}
What the chain shows.
:::
````

`::card[Title]` starts a card and the lines below it are its text. `href` makes the title a link: `/…` paths and full URLs are used as written, and a relative path such as `token.md` resolves like any other docs link. A card without `href` is not linked. `icon` is optional. The supported icons are `book`, `rocket`, `coin`, `shield`, `code`, `terminal`, `chat`, `settings`, `star`, `link`, `question`, `bolt`, `file`, `image`, `video`, `idea`, `wallet`, `lock`, `users`, `globe`, `chart`, `bell`, `key`, `flow`, `telegram`, `x`, `github`, `layers`, `compass`, `sparkles`, `home`, `search`, `calendar`, `gift`, `receipt`, `plug`, `list`, `check`, `warning` and `info`; an unknown name shows no icon. Cards stack on narrow screens.

Cards sit in a two-column grid by default; write `:::cards{cols=3}` for three columns.

## Steps

````markdown
:::steps
### Link your token
Open Settings and link it.
### Bring it to Claire
Follow the dialog.
:::
````

Every `###` heading inside the block starts a numbered step. Text before the first heading stays plain.

## Columns

````markdown
:::columns
::column
Left column.
::column
Right column.
:::
````

Columns sit side by side and stack below 768 px.
