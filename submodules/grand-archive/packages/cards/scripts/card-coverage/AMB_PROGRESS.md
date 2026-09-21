# AMB acceptance coverage

Complete acceptance accountability for Grand Archive set AMB.
`coverage.json` is the source-derived authority for per-card and per-ability
statuses.

## Current result

- Canonical cards: **239/239 complete**.
- Printed abilities: **415/415 covered** (384 proven + 31 centrally covered).
- Direct card-behavior proofs: **384**.
- Centrally covered intrinsic keywords: **31**.
- Untested abilities: **0**.

Centrally covered rows are exact, unconditional, parameter-free intrinsic
keyword paragraphs whose engine-owned suites are explicitly enabled in
`central-keywords.ts`. Direct `@covers` evidence always wins. Restricted,
parameterized, grouped, granted, used, custom-zone, or otherwise card-specific
keyword text remains accountable to its card test and is never auto-exempted.

Negative coverage tests in `src/card-coverage-central-keywords.test.ts` prove
AMB Pride, Link, Class Bonus Floating Memory, Class Bonus Ranged, Class Bonus
Stealth, damage-restricted Cleave, and named Lineage stay card-specific.

ALC remains complete at 210/210 cards and 400/400 abilities.

## Completion verification — 2026-09-13

The fresh authoritative report identified **no incomplete AMB cards and no
uncovered AMB abilities**. Its parsed contents matched the starting report for
every card and ability across all sets. AMB was already complete; this pass
verified the existing implementation rather than adding coverage claims.
ALC, the other previously completed set, retains 397 direct proofs and three
central keyword proofs. No engine or compiler repairs were needed in this pass.

- Focused AMB suites plus central-keyword negative guards: **236 files,
  672 tests passed**.
- `pnpm run ci-check` from `submodules/grand-archive`: **passed**.
- Generated output: two consecutive regenerations reproduced all 2,495 cards
  and preserved sibling tests. No generated changes remain inside or outside
  AMB. Fingerprint:
  `9d450d48e39617b78d7b6622f5f95da1257bd7a2f72448f7944933ee7f2cc2f9`.
- Rules audit: **300/300 implemented**, zero partial, missing, or pending units.
- Coverage freshness check and all five workspace type checks: **passed**.
- Full card package: **529 files, 2,084 tests passed**.
- Full engine package: **171 files, 847 tests passed**; two existing skipped
  files containing three skipped tests remain outside the enabled central
  keyword evidence contracts.
- Catalog and scraper: **two files, four tests passed**.
- `git diff --check`: **passed**.

The only retained change from this verification is this progress record.

## Reproduce

From `packages/cards`:

```sh
vp run coverage:cards:write
vp test src/card-coverage-central-keywords.test.ts --run
vp test src/cards/AMB --run
```
