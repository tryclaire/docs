---
title: Text and images
description: Images with captions, callouts, tables and code blocks in docs pages.
icon: image
order: 24
---

# Text and images

Plain Markdown for the everyday blocks.

## Images

````markdown
![Alt text](https://example.com/chart.png)

![Alt text](https://example.com/chart.png "Caption under the image")

![Alt text](https://example.com/chart.png "Caption"){width=medium align=center}
````

A plain image is unchanged. A quoted title becomes a caption under the image. The optional `{…}` block sets `width` (`small`, `medium` or `full`) and `align` (`left`, `center` or `right`). Always write alt text. On a public docs site, clicking an image opens it larger; Esc closes it.

To show different images in light and dark mode, add GitHub's fragments. Claire's docs are dark, so the `#gh-light-mode-only` image is hidden and the `#gh-dark-mode-only` image is shown, without the fragment:

````markdown
![Dashboard](dashboard-light.png#gh-light-mode-only)
![Dashboard](dashboard-dark.png#gh-dark-mode-only)
````

## Callouts

````markdown
> [!NOTE]
> Background information.
````

The types are `NOTE`, `TIP`, `IMPORTANT`, `WARNING` and `CAUTION`.

## Tables

````markdown
| Plan | Seats |
| --- | --- |
| Free | 1 |
| Team | 10 |
````

The Insert menu creates 1 to 8 columns and 1 to 20 rows.

## Code blocks

````markdown
```ts
const answer = 42;
```
````

The language after the opening fence selects syntax highlighting. An unknown or missing language renders as plain text.
