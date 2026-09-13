# Gundam New-Card Parser And Behavior Audit

**Status**: in-progress
**Owner**: Codex
**Started**: 2026-07-19

## Goal

Add every canonical Gundam card newly exposed by the refreshed official-card
scrape, verify each definition against its printed contract, and give every
card an executable behavior test. Parser output is only a starting point: the
engine-visible result must match every printed timing, cost, condition, target,
choice, branch, duration, restriction, and source-card zone transition.

## Scope

- In scope: GD05, ST10, EB01, newly published Resource/EX/Token definitions,
  parser fixes, typed engine primitives required by those cards, sibling card
  behavior tests, canonical inventory/audit updates, and refreshed scraped
  fixtures.
- Out of scope: unrelated platform deck-workbench changes already present in
  the shared checkout, simulator UI changes, publication, and GitHub CI.

## Approach

- Preserve the existing platform changes and keep all implementation inside
  `submodules/gundam`.
- Generate only missing definitions from the refreshed scraped JSON; never
  overwrite audited existing card definitions automatically.
- Process cards in bounded release-set waves. Start with the smaller ST10 wave
  to expose parser/engine gaps cheaply, then GD05 and EB01, followed by setup,
  Resource, and Token cards.
- For each non-vanilla card, decompose printed text and compare it with fresh
  parser output. Add behavior tests through `GundamTestEngine` public moves and
  repair the narrowest owning parser/card/engine layer.
- Use parameterized public-move tests for genuinely vanilla cards and
  reminder/setup-only cards where card-specific effect branches do not exist.
- Stop a wave on unexplained focused failures. Record recurring parser or
  engine gaps before promoting shared primitives.

## Verification

- Focused parser tests for every parser change.
- Every new card definition has a non-empty sibling behavior test and passes
  `tools/harness/check-card-fixtures.mjs`.
- Targeted card suites pass per wave.
- `vp test packages/cards --run` and the cards package check pass at wave
  boundaries.
- If shared engine behavior changes: focused engine tests, then
  `vp test packages/engine --run` and `vp check`.
- Regenerate `docs/card-implementation-audit.md` and the structured effect
  snapshot; require zero missing implementation/test evidence.
- Run the Gundam local CI graph only after focused and package gates pass.

## Open Questions

- Which newly printed mechanics require typed engine extensions rather than
  parser-only recognition? Resolve from failing focused card tests and the
  comprehensive rules.
- Whether newly scraped promotional Resource and Token printings are canonical
  gameplay additions or art-only variants. Resolve by canonical number,
  printed stats/text, and existing token/resource ownership before generation.

## Decision Log

- 2026-07-19 — Treat 261 missing canonical numbers as an inventory lead, not
  an implementation count, because setup cards, Resource art variants, Tokens,
  and parallel printings have different owners and proof shapes.
- 2026-07-19 — Start with ST10 before the larger GD05 and EB01 sets so parser
  and engine gaps surface in a bounded 16-card wave.
- 2026-07-19 — The live generated-card audit found 229 missing behavior
  fixtures and 60 definitions with at least one `unparsedText` directive.
  Shared parser repairs reduced the latter to 46; both queues remain release
  blockers.
- 2026-07-19 — Model ST10-014's optional discard payment as a typed Command
  play-cost substitution. Its public move now exposes normal/alternate modes,
  validates the G Generation Unit discard, pays Lv./cost 2, and logs the cost.
- 2026-07-19 — Individually verified ST10-002, ST10-013, and ST10-014 with 25
  focused public-engine behavior tests. The aggregate simulator fixture then
  proved ST10-013's recovery/AP modifier and ST10-014's normal payment/draw in
  the in-app browser; its alternate-mode UI binding also has a focused JSDOM
  test. The browser pass exposed and fixed a missing `crypto.randomUUID`
  fallback and a fixture-only deck-out setup error.
- 2026-07-19 — The latest fixture gate reports 227 canonical definitions still
  missing sibling tests, and the regenerated implementation audit reports 199
  effect-bearing cards still needing implementation or verification. This plan
  remains in progress; the visual proof is complete for the reviewed ST10
  sample, not for the remaining inventory.
- 2026-07-26 — Refreshed all 21 official catalog buckets after the GD05/SC01
  release. Added the 11 absent setup definitions (EXR-004 through EXR-011 and
  EXBP-025 through EXBP-027), reconciled all 1,777 official printing IDs, and
  added one public-engine behavior test per new definition. Setup reminder text
  remains rules-owned rather than emitted as an `unparsedText` card effect.
- 2026-07-26 — The clean Gundam assets worktree already contained part of the
  release; downloaded its remaining 73 official images, regenerated the
  2,043-entry asset index, and verified zero official printing IDs without an
  asset. The broader fixture gate still reports 228 older cards without sibling
  tests, so this release slice is complete while the overall audit remains in
  progress.
