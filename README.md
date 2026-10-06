# Claire documentation

Public documentation source for [Claire](https://tryclaire.net), rendered by Claire at
[docs.tryclaire.net](https://docs.tryclaire.net). Start with the [Introduction](docs/index.md).

## Contribute

Edit pages under `docs/` and open a pull request against `main`. Describe the user-visible
change and verify it against the current product. Do not include secrets, internal operator
notes, private source data, or promises of unshipped features.

Use Node.js 22 or newer:

```sh
npm ci --ignore-scripts
npm run check
```

CI checks Markdown structure, relative file/image links, and Markdown heading fragments.
External URLs are not fetched, so provider outages cannot block a documentation change.
Review external links and the rendered page when changing them.

Keep existing paths stable. Use relative Markdown links, such as `../sources/telegram.md`.
Pages use `title` and `order` front matter; `index.md` is a section's landing page.
Use ordinary Markdown rather than executable MDX components. Repository housekeeping belongs
outside `docs/` so it is not published as a product page.

Changes go through a pull request with a passing **Docs check** before merging. A second
person's approval is not required, so a solo maintainer can merge their own checked PR.
CI has read-only repository permissions, uses pinned actions and a dependency lockfile,
and requires no provider or deployment secrets.

## Connect publishing

The repository is prepared for the owner to switch the existing Claire workspace source:

- Repository: `tryclaire/docs`
- Branch: `main`
- Folder: `docs`

Give the Claire GitHub App access to this repository and refresh the workspace's GitHub
connection if it is missing from the verified repository list. Change the existing source
in Site → Docs and sync; do not disconnect first, because disconnecting removes imported pages.
The existing domain and hosting stay in place. Verify navigation and existing URLs after syncing.

Once connected through the GitHub App, pushes to `main` affecting `docs/` enqueue a sync;
merged documentation publishes without a separate approval in Claire. CI does not deploy
anything itself. The old monorepo copy remains until the owner completes and verifies the
source switch; remove it afterward so there is one source of truth.

## License

No reuse license has been selected yet. Public visibility is not a grant of an open-source
license; the owner must choose one before this repository is advertised as open-source.
