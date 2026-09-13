# ALC acceptance coverage

ALC has reached complete acceptance accountability. `coverage.json` is the
source-derived authority for per-card and per-ability statuses.

## Final result

- Canonical cards: **210/210 complete**.
- Printed abilities: **400/400 covered**.
- Direct card-behavior proofs: **397**.
- Centrally covered intrinsic keywords: **3**.
- Untested abilities: **0**.
- ALC suite: **210 files, 1,144 tests passing**.

The three centrally covered rows are exact, unconditional, parameter-free
intrinsic keyword paragraphs whose engine-owned suites are explicitly enabled in
`central-keywords.ts`. Direct `@covers` evidence always wins. Restricted,
parameterized, grouped, granted, used, custom-zone, or otherwise card-specific
keyword text remains accountable to its card test and is never auto-exempted.

## Reproduce

From `packages/cards`:

```sh
vp run coverage:cards:write
vp test src/card-coverage-central-keywords.test.ts --run
vp test src/cards/ALC --run
```

The final ALC slice of `scripts/card-coverage/coverage.json` must report 210
cards, 400 abilities, 397 direct proofs, 3 central proofs, and zero untested.

Resolved definition and engine gaps are retained as reproducible records in
`gaps.json`; no ability is credited merely because its generated definition
compiles.
