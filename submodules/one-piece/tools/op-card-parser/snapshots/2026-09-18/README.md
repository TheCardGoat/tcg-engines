# optcgapi.com snapshot — 2026-09-18

Raw print data fetched from `https://www.optcgapi.com/api` (the scraper source
wired in `src/scrapers/optcg-api.ts`) on 2026-09-18. One JSON file per upstream
`/api/sets/{id}/` response, plus `missing-vs-catalog.json`, the id-level diff
against the checked-in catalog.

## Why this snapshot

The catalog had no data for three live products (confirmed against the official
en.onepiece-cardgame.com card list):

- `OP15-EB04` — Adventure on Kami's Island (OP15- + EB04-numbered cards)
- `OP-16` — The Time of Battle
- `OP-17` — The World's Strongest Warriors

plus 14 scattered backfill ids in OP-08, OP-10, OP-12, OP-13, EB-01, EB-02,
and OP14-EB04. `missing-vs-catalog.json` lists the **408 unique missing card
ids** (413 set-level entries; some ids appear under two upstream sets).

## Caveats for the normalizer

- Parallel arts arrive as duplicate entries sharing one `card_set_id` (756
  collisions here); dedupe by id before normalizing, as the canonical-card
  migration tooling already does.
- Vanilla Characters arrive with `card_text: null` (145 entries) although
  `RawOPCard.card_text` declares `string`; the normalizer already coalesces
  with `raw.card_text ?? ""`.
- Upstream added a `date_scraped` field not present in `RawOPCard`; it is
  ignorable extra data.
- Upstream groups some printings under neighboring products (for example
  `OP16-098` inside `OP-17`, `ST26-001` inside `OP15-EB04`); group by
  `card_set_id` prefix, not by set file.

## Regenerating

`node --experimental-strip-types ../../packages/cards/scripts/optcgapi-snapshot.mjs`
re-fetches into `OP_API_SNAPSHOT_DIR` (cached per set). Its `API_SET_IDS`
includes all sets captured here.
