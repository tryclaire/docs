---
title: Rich content
description: Add images, callouts, tabs, cards, steps, embeds and diagrams to docs pages with plain Markdown.
icon: sparkles
order: 23
---

# Rich content

Docs pages are plain Markdown with a few extra blocks. The Claire editor stays a Markdown editor with a live preview, and an **Insert** menu adds the blocks for you. Pages synced from GitHub use the same syntax, so everything below also works in your repository's `.md` files. GitHub's own preview does not know the extra blocks and shows them as plain text; Claire renders them. Anything it does not recognize renders as ordinary Markdown.

![The Insert menu in the docs editor, listing Image, Callout, Table, Code block, Collapsible section and Tabs, then scrolled to Cards, Steps, Columns, Video / embed, Diagram and File.](../../images/insert-menu.webp)

![A published docs page showing tabs with a code block, a numbered steps list, two linked cards with icons and a Mermaid flow diagram.](../../images/rich-content-rendered.webp)

## Block syntax

:::cards{cols=3}
::card[Text and images]{href=text-and-images.md icon=image}
Images with captions, callouts, tables and code blocks.
::card[Layout blocks]{href=layout-blocks.md icon=layers}
Collapsible sections, tabs, cards, steps and columns.
::card[Media and diagrams]{href=media-and-diagrams.md icon=video}
Video embeds, files and Mermaid diagrams.
:::

## Insert menu and slash commands

In **Docs**, the formatting bar has an **Insert** menu next to the existing toolbar buttons. You can also type `/` at the start of an empty line. Both open the same list of blocks:

- Arrow keys move through the list, Enter inserts the highlighted block, and Esc closes it.
- With `/`, keep typing to filter the list, for example `/tab`.
- Blocks that need input open a small dialog first: image options, callout type, table size, code language, tab labels and the embed URL. The rest insert immediately.
- Images and files can be uploaded, pasted, dropped on the editor or picked from **Assets**.

The inserted text is ordinary Markdown that you can edit by hand. The pages above show the syntax for each block.

## Nesting

Tabs, cards, steps, columns and collapsible sections can be nested one level deep, for example a code block or steps inside a tab. A block that is not closed with `:::`, or nested deeper than that, renders as ordinary text.

## Search and sync

Docs search indexes image captions, tab labels, card titles, collapsible summaries and file names. Embed URLs are not indexed. For GitHub-synced pages, write the blocks in the `.md` files in your repository. Uploaded videos and files are served from workspace storage, so use the URL of a file uploaded in **Assets** for those.
