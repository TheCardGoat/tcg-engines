# Lorcana Typography Font Assets

This directory holds bundled font files used by the simulator hover-card typography.

Expected files:

- `the-bystander-collection-sans-medium.woff2`
- `brandon-text-condensed-bold.woff2`
- `brandon-text-condensed-black.woff2`
- `brandon-text-condensed-black-italic.woff2`
- `brandon-text-condensed-medium-italic.woff2`
- `bogle.woff2`
- `bbh-sans-bogle.woff2`

Notes:

- `bbh-sans-bogle.woff2` is bundled from the public `@fontsource/bbh-sans-bogle` package.
- The remaining Lorcana display faces are bundled `woff2` assets so simulator typography stays consistent across devices.
- `Bogle` resolves to the bundled `bogle.woff2` first and falls back to the bundled `BBH Sans Bogle` webfont.
- Font-family mapping is defined in `/src/lib/app.css`.
