# Gundam Card Behavior-Test Hardening

**Status**: active
**Owner**: Codex coordinator
**Branch**: `codex/gundam-card-audit-waves`

## Goal

Make every Gundam card test an executable player-behavior specification. A card
test must use a valid deterministic fixture, drive the engine only through
public player moves, and assert only information a player can observe. It must
not prove a card by inspecting its declarative structure or raw runtime state.

## Acceptance Criteria

1. Every card with authored effects or keywords, including BETA duplicates,
   has a sibling behavior suite with no skipped structural-only case.
2. Every individual behavior test creates a valid `GundamTestEngine` fixture
   and executes at least one public player move, directly or through a narrowly
   approved helper composed of public moves.
3. Card suites do not read `effects`/`keywordEffects`, raw engine state,
   pending-effect storage, hidden Deck/Shield identities, or use test-only
   gameplay/state shortcuts as proof.
4. Prompt tests assert player-visible owner, legal candidates or options,
   applicable bounds/optionality, selected identity, visible continuation, and
   terminal prompt state.
5. Vanilla catalogs use public moves and player-visible assertions appropriate
   to deployable cards and tokens; they do not assert definition shape.
6. The card-fixture harness enforces the completed boundary for every covered
   card rather than only canonical sets.

## Evidence And Boundaries

- Owner: `submodules/gundam/packages/cards`, with coordinator-owned changes to
  `tools/harness`, engine test helpers, and test-generation documentation.
- First rejecting check: `node tools/harness/check-card-fixtures.mjs` with the
  strict behavior contract applied to every effect/keyword card definition.
- Focused proof: each repaired sibling test, then the cards package test/check.
- Broad proof: Gundam harness, engine/package checks if shared helpers change,
  and `pnpm run ci-check` at completed waves.
- No GitHub checks, comments, reviews, or CI are a quality gate for this work.

## Execution

1. Record a deterministic baseline of every structural, raw-state, shortcut,
   hidden-information, fixture, public-move, and prompt-contract violation.
2. Harden the harness only after its baseline report is reproducible; do not
   hide a violation through an allowlist.
3. Repair violations in bounded card-file waves. For each file, read printed
   text and the definition, replace only the invalid proof with a real player
   flow, run the focused test, and stop on an unexplained failure.
4. At each wave boundary, rerun the strict harness and cards package test,
   record the count reduction and any reusable engine/projection need.
5. When the report reaches zero, update the test-generation guidance to remove
   invalid examples, run all local gates, review the full diff, and publish.

## Stop Conditions

- A behavior cannot be observed through public moves or projection and the
  smallest generic engine/projection addition is blocked by an unresolved rules
  ambiguity.
- A focused reproduction still fails after one reasonable owner-correct repair.
- The strict report and all selected local gates pass.
