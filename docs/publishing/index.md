---
title: Publishing
order: 7
---

# Publishing

Set up a public profile and publish docs from Claire or a GitHub repository. Your site's profile and docs use your workspace slug unless you connect a custom domain.

## Set up your public site

1. In Site, set your project's public profile, logo, and accent.
2. Publish pages in Site › Docs to make them visible in your site's docs section.
3. Optionally connect a custom domain for the profile or docs. A profile domain serves docs at `/docs`; a dedicated docs domain serves them at its root.

## Sync docs from GitHub

### Public repository

1. In Site › Docs, paste the GitHub URL or `owner/repo`.
2. Select a branch and optional folder.

### Private repository

1. Install the Claire GitHub App and give it access to the repository. The app's access to repository contents is read-only.
2. In Claire, select that installation's repository, branch, and folder.

A push changing the selected folder triggers a re-sync. You can also request a sync manually. If sync fails, the saved connection and error remain visible. Edit GitHub-backed pages in GitHub, not in the Claire editor.

> [!WARNING]
> Synced docs and copied images are public, even when the source repository is private. Do not sync confidential text or images.

## Organize imported pages

Place `.md` files in the selected folder. Optional frontmatter `title` and `order` set page titles and navigation order. An `index.md` or `README.md` leads its folder; relative links to other `.md` files become docs page links.

Keep relative images inside the repository. During private repository sync, Claire copies them into workspace storage and serves them at public file URLs. GitHub-imported pages publish immediately on sync. See [current limits](../reference/index.md) for import and storage bounds.
