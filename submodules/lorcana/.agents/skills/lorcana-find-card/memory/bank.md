# Lorcana Find Card Memory Bank

Schema: [`schema.md`](./schema.md) (extends canonical [`../../lorcana-cards/memory/schema.md`](../../lorcana-cards/memory/schema.md)). Demoted/expired entries: [`archive.md`](./archive.md).

## Guardrails

- **G-01**: Always return both definition and test paths when they exist. Why: downstream skills consume both; missing one forces re-lookup. Applies: every successful lookup.
- **G-02**: Keep ranking deterministic; pin `scoringVersion` in every output. Why: callers reproduce results across sessions. Applies: every output.
- **G-03**: Recent set is a tie-breaker only, never a primary score signal. Why: prevents new sets from drowning the right historical reference. Applies: scoring only.
- **G-04**: On `status: "ambiguous"`, ask the user; never auto-pick by score. Why: ambiguity often signals an off-by-one or punctuation drift the user can resolve in one word. Applies: every ambiguous result.
- **G-05**: When a query looks "missing" but contains an apostrophe, check both legacy (`world-s-...`) and normalized (`worlds-...`) slug forms before returning `not_found`. Why: inventory drift is the most common cause of false negatives. Applies: lookup fallback path.

## Promoted Rules

### PR-01 — apostrophe-slug-normalization

- **claim**: Legacy and current Lorcana repos use different apostrophe normalization for possessive slugs. Lookups that hit `not_found` on a punctuated query may resolve under the alternate form.
- **scope**: Lookup fallback when the fast-path CLI returns `not_found`.
- **evidence**: 3 distinct cases in 2026-03 (`Worlds Greatest Criminal Mind`, set-011 location batch, set-006 chunk-10).
- **verification**: `rg --files packages/lorcana/lorcana-cards/src/cards | rg '<both-forms>'`
- **last_checked**: 2026-04-27

### PR-02 — fixture-vs-inventory-drift

- **claim**: Simulator deck-fixture coverage and audit-inventory coverage drift independently. Cross-check the resolved fixture pool against `missingImplementation`/`missingTests` before assuming an inventory-tracked batch is exhaustive.
- **scope**: Migration audit work driven by deck fixtures.
- **evidence**: O-2026-03-15 (deck-fixture-crosscheck), `Rapunzel - Gifted with Healing` was missing from inventory but live in fixtures.
- **verification**: `rg -l 'missingImplementation: true|missingTests: true' packages/lorcana/lorcana-cards/src/cards/<SET>` cross-referenced against `AUDIT_INVENTORY.md`.
- **last_checked**: 2026-04-27

## Candidates

(none — observations during initial migration were already promotable; new candidates accrue here.)

## Observations

### O-2026-04-11-the-958-merlin-disambiguation

- **signal**: Multiple Merlin printings made bug-triage queries ambiguous when the report omitted set/number. Similarity CLI fast-path returned the right card with explicit set-number form (`005-159-merlin-intellectual-visionary`).
- **impact**: For named characters with many printings, lock to canonical id and file paths first via the CLI before writing regressions.
- **verification**: `bun packages/lorcana/lorcana-cards/src/cards/similarity.ts --query "Merlin - Intellectual Visionary" --limit 8`
- **candidate_for**: new (multi-printing-disambiguation).

### O-2026-03-22-sebastian-vanilla-implementation

- **signal**: For vanilla cards, `inkable` decides whether to test ink action.
- **impact**: Vanilla card test scaffolds should branch on `inkable`.
- **verification**: `bun test packages/lorcana/lorcana-cards/src/cards/010/characters/016-sebastian-loyal-crab.test.ts`
- **candidate_for**: folded into `lorcana-test-generation` patterns.
