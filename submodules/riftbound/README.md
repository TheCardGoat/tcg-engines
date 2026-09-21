# Riftbound reference catalog

This workspace ingests official Riftbound card metadata for reference and
presentation. It does not interpret card text or implement game rules.

## Official gallery data

The official Card Gallery is keyless and can be used to build the bundled
catalog consumed by the browser and server adapter:

```sh
vp run scrape:gallery -- --locale en-US
vp run generate -- --input .cache/raw/riot-card-gallery/en-US/<snapshot>.json
vp run verify:catalog -- --input .cache/generated/riftbound-catalog.json
```

The scraper reads the gallery page's single `__NEXT_DATA__` JSON script and
fails if the page does not embed a complete catalog. The gallery smart list's
`totalItems` counts records the site never publishes (it has exceeded the
embedded payload by the same handful across every locale), so completeness is
proven structurally: every declared set must embed its full base collector
number range `1..collectorNumberMax`, and the scraper fails naming any missing
numbers. It never executes the script, crawls individual card pages, or calls
the gallery's undocumented publishing backend. Raw artifacts remain under
`.cache/`; generated catalog files may be written to `packages/cards/src/generated`
for the application build.
Generation emits deterministic `riftbound-catalog` files plus a separate
locale-owned `riftbound-translations` companion. Card and set IDs bind the two
artifacts; translated names are never used as identities.

## Authenticated Riot API data

The production adapter uses Riot's documented regional content endpoint and
requires a server-side key:

```sh
RIOT_API_KEY=... vp run scrape:riot -- --locale en --region europe
vp run generate -- --input .cache/raw/riot-content-api/en/<snapshot>.json \
  --out packages/cards/src/generated --production
```

The authenticated response schema remains provisional until a real response can
be captured and redacted. Generation requires official provenance, a source
version, HTTPS source URL, timestamp, locale, and payload checksum.

Community card databases are not fallback sources. Gallery artifacts are
accepted when their official provenance validates. Platform catalog routes read
the generated card-package import. Until an authenticated Riot API catalog is
generated, that import is the explicit empty catalog; no runtime catalog path
is supported.
