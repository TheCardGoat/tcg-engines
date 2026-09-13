# The FAB Cube catalog ingest

The sole FAB metadata source is
[`the-fab-cube/flesh-and-blood-cards`](https://github.com/the-fab-cube/flesh-and-blood-cards).
The refresh command resolves the configured branch to an immutable commit,
downloads English cards, sets, and both upstream schemas by that SHA, stores a
hashed raw snapshot, regenerates the central catalog and every available
localized translation catalog from that same immutable SHA, runs the
stable-identity removal guard, and prints a grouped change report:

```sh
pnpm run refresh:source
```

The initial configured ref is `usurp-the-shadow-throne`. Pass
`-- --ref develop` only after that branch contains every current canonical ID.
Source removals require `-- --allow-removals` after reviewing the printed diff.

Card `unique_id` is our `canonicalId`; printing `unique_id` is `printing.id`;
`set_printing_unique_id` is the artwork identity. Upstream image URLs are
private build inputs in the raw snapshot. Generated runtime metadata emits only
full-card and cropped board URLs present in the assets repository's schema-4
`public/fab/cards/index.json` manifest. Catalog generation and refresh require
that manifest explicitly; a printing without a manifest entry receives an
empty `imageUrl` rather than a guessed path:

```sh
pnpm run generate -- --input .cache/raw/fab-cube/en-US/<sha>.json \
  --asset-manifest ../../../assets/public/fab/cards/index.json
pnpm run refresh -- --asset-manifest ../../../assets/public/fab/cards/index.json
```

The ingest handles printed metadata only. It does **not** author, infer, or
overwrite abilities or executable behavior. Authored modules under
`packages/cards/src/cards/` remain the gameplay source of truth.

Runtime card text, printings, sets, and legalities are exported only from the
generated central catalogs. Set barrels export executable card definitions but
do not re-export the legacy per-card i18n or per-set metadata/legality files;
inventory also reads printed text from the generated catalog.

`audit` classifies catalog identity and runtime asset reuse without downloading files:

```sh
pnpm run audit:catalog -- --input packages/cards/src/generated/flesh-and-blood-card-data.json
```

Cross-card artwork ids and reduced physical-identity collisions must be resolved
upstream before any printing is removed. Corrections belong in The FAB Cube and
are consumed through a subsequent immutable revision; no local metadata overlay
is retained as an independent authority.

English translation catalogs must cover every canonical card and set. Other
locales may be partial because not every card is printed in every language;
their entries must still be unique and reference known canonical identities.
Localized catalogs retain their own source provenance and are exposed through
selective package imports such as
`@tcg/flesh-and-blood-cards/translations/fr-FR`. Regenerate only the localized
artifacts when needed with the asset manifest. From the Flesh and Blood
workspace root in the integrated repository checkout:

```sh
pnpm --dir tools/catalog run generate:localized -- --ref develop \
  --asset-manifest ../../../../../assets/public/fab/cards/index.json
```

The manifest path is resolved from the `tools/catalog` package directory where
pnpm runs the command; adjust it if the assets repository is elsewhere.

Each locale is rebuilt rather than merged with old output, so upstream removals
and corrections cannot leave stale localized printings behind. Upstream image
URLs remain private raw-snapshot inputs. Localized `imageUrl` and `boardImageUrl`
are resolved together from the supplied manifest using the exact printing id,
canonical card owner, and locale. Printings absent from the manifest retain
empty image fields; malformed or mismatched mappings fail generation. Use a
published manifest for runtime catalogs so emitted URLs are already available.
