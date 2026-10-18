# Claire documentation

Public documentation source for [Claire](https://tryclaire.net), published at
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
Pages use `title`, `description`, `icon` and `order` front matter; `index.md` is a section's landing page and may add `tab` to place the section under a top tab. Pages can use cards, steps, tabs and collapsible sections, as the existing pages do.
Use ordinary Markdown rather than executable MDX components. Repository housekeeping belongs
outside `docs/` so it is not published as a product page.

Screenshots live in `docs/images/` and are linked with relative Markdown image syntax, such as
`![Alt text](../images/token-page.webp)` (one more `../` from a page in a subfolder); raw HTML `<img>` tags are not resolved.
An image appears once its change is merged to `main`.
Use PNG or WebP under 250 KB, crop to the relevant component, and write descriptive alt text.
Public screenshots must not show test funds, local-fork labels, chain ids of test networks,
test accounts or internal organization names.

Changes go through a pull request with a passing **Docs check** before merging. A second
person's approval is not required, so a solo maintainer can merge their own checked PR.
CI has read-only repository permissions, uses pinned actions and a dependency lockfile,
and requires no provider or deployment secrets.

## Publishing

The documentation site is built from this repository (branch `main`, folder `docs`). CI checks
the repository but does not publish anything. Do not document rollout-gated features (such as
Ethereum/Stockereum availability) as generally available until they are verified in production.

## License

Copyright © 2026 Claire documentation contributors.

The documentation in this repository is licensed under
[Creative Commons Attribution 4.0 International (CC BY 4.0)](LICENSE).
You may share and adapt it, including commercially, with attribution to Claire,
a link to the license, and an indication of any changes.
The license does not grant rights to Claire's trademarks.
