---
title: Docs from GitHub
description: Sync Markdown docs from a public or private GitHub repository and organize the imported pages.
icon: github
order: 22
---

# Docs from GitHub

Sync a repository folder and Claire imports its `.md` files as docs pages.

## Connect a repository

:::tabs
::tab[Public repository]

1. In **Docs**, paste the GitHub URL or `owner/repo`.
2. Select a branch and optional folder.

::tab[Private repository]

1. Install the Claire GitHub App and give it access to the repository. The app's access to repository contents is read-only.
2. In Claire, select that installation's repository, branch, and folder.

:::

A push changing the selected folder triggers a re-sync. You can also request a sync manually. If sync fails, the saved connection and error remain visible. Edit GitHub-backed pages in GitHub, not in the Claire editor.

> [!WARNING]
> Synced docs and copied images are public, even when the source repository is private. Do not sync confidential text or images.

## Organize imported pages

Place `.md` files in the selected folder. An `index.md` or `README.md` leads its folder; relative links to other `.md` files become docs page links. Optional frontmatter sets how each page appears:

| Frontmatter | Effect |
| --- | --- |
| `title` | The page title. |
| `order` | Position in the navigation. |
| `description` | One sentence shown under the page title, in the page's meta description and as the card and search excerpt. |
| `icon` | The icon in the sidebar and on cards. Use one of the [card icons](rich-content/layout-blocks.md#cards). |
| `tab` | On a top-level folder's `index.md` only: the label of the top tab that folder belongs to. Folders without `tab` fall under the first tab, and with no `tab` anywhere the site shows no tab bar. |

Keep relative images inside the repository. During private repository sync, Claire copies them into workspace storage and serves them at public file URLs. GitHub-imported pages publish immediately on sync. See [current limits](../reference/limits.md) for import and storage bounds.
