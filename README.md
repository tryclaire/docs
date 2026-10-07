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

## Publishing

Edit pages under `docs/`, run `npm run check`, and open a pull request. Once connected,
merges to `main` affecting that folder enqueue a Claire sync. CI checks the repository;
it does not publish the pages itself. Check Site → Docs sync status and rendered navigation
before announcing a change as live.

Before publishing the token/vesting update, verify the advertised workflows in production.
Ethereum/Stockereum availability and the SDK's new token fields must match the enabled
deployment and released npm version. Remove rollout/unreleased notes only after verification.

If the workspace has not switched its existing docs source to this repository, the owner
must first complete the one-time source switch:

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

Copyright © 2026 Claire documentation contributors.

The documentation in this repository is licensed under
[Creative Commons Attribution 4.0 International (CC BY 4.0)](LICENSE).
You may share and adapt it, including commercially, with attribution to Claire,
a link to the license, and an indication of any changes.
The license does not grant rights to Claire's trademarks.
