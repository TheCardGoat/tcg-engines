# FAB card release audit — final report

Date: 2026-08-30  
Baseline: `6af37fbca0`  
Audit branch: `codex/fab-card-release-audit`

## Outcome

- Authored units: 3,226 covering 5,024 canonical cards and 16,829 printings.
- Evidence-backed audited rows: 3,144 (baseline: 23; net closure: 3,121).
- Recorded-gap rows: 82. Every unchecked row names at least one open family from
  `packages/cards/scripts/card-coverage/gaps.json`; there are zero unexplained unchecked rows.
- Open gap registry: 63 families / 89 canonical members.
- Authored-side audit: green — zero definition, i18n, or test issue families; zero missing
  non-exempt test modules; canonical authoring reports zero issues across 3,229 executable modules.
- Catalog-only backlog: 317 units with missing image and board URLs. This does not block the
  authored release gate and is handed off in `docs/card-release-asset-backlog.md`.

## Waves executed

1. Re-baselined the live catalog, authored triples, existing tests, locales, and asset gaps.
2. Reviewed existing suites and definitions in hash-scattered batches so workers did not claim
   adjacent cards or a shared sequential range.
3. Closed missing-test waves with real authored-card AAA play lines; low-value structural tests
   and synthetic stand-ins were rejected or replaced.
4. Recorded genuinely unprovable behavior in the canonical gap registry and removed evidence
   for every affected authored unit.
5. Re-audited all 129 units changed by the final play-legality migration in four SHA-partitioned
   lanes, then reviewed a later three-trap mini-wave before refreshing its hashes.
6. Reconciled content-addressed evidence, regenerated the ledger, ran strict integration gates,
   the complete cards/engine suites, and all package builds.

## Tests

- New per-card test files since the baseline: 314. The authoritative path inventory is:

  ```sh
  git diff --name-status 6af37fbca0 -- packages/cards/src/cards \
    | awk '$1 == "A" && $2 ~ /\.test\.ts$/{print $2}'
  ```

- Net units with test twins: 2,903 → 3,205 (+302); the difference from 314 added files reflects
  removal of superseded filler/white-box suites during quality cleanup.
- Documented exemptions: 27 units across non-card runtime kinds and out-of-scope Event behavior.
- Final cards suite: 3,229 files, 9,661 tests passed.
- Final engine suite: 851 files passed, 1 skipped; 4 expected failures and 1 skipped test remain
  explicitly classified by the engine suite.
- Audit/evidence protocol tests: 19/19 passed.

## Root-cause families fixed

- Canonical authoring and i18n drift gates, including exact catalog name/typeText ownership.
- Missing test-token registration and numerous real card definition defects found during closure.
- Play legality: restrictions use `role: "condition"`; permissions and play effects declare exact
  origins. The one unsupported permission-composition case remains recorded for Teklovossen.
- `unless` discard decisions now check the target's available cards and prompt the escape payer,
  proven by Cheap Shot's discard, decline-damage, and instant-timing boundaries.
- Danse Macabre binds the entered ally's attack without requiring the Ally card to have subtype
  Attack; its first-attack go again and end-phase destruction are both proven.
- Audit marks are content-addressed. Stale definition/i18n/test hashes, malformed gap members,
  evidence on open gaps, and generated-doc drift now fail the consistency gate.
- Test-quality cleanup replaced private state, bare throws, implementation-shape assertions, and
  known-bug pins with public, rule-visible assertions.

The complete dated root-cause log is generated into `docs/card-release-audit.md`.

## Operations handoff

- Asset URLs: `docs/card-release-asset-backlog.md` lists all 317 affected units and 544 affected
  printings by set, collector number, canonical id, printing id, and missing URL field. URLs must
  be repaired upstream and flow through `authoring/locale-assets.ts`; card files must remain URL-free.
- Missing upstream text: all 38 catalog cards without `functionalTextPlain` were reviewed as the
  genuine textless class (vanilla attacks, Proto base equipment, and resources). Battle Prep's
  catalog `Opt 1` metadata remains flagged because the printed card and authored behavior say Opt 2.
- Locales: en-US is the only complete upstream source. Existing de-DE/es-ES/fr-FR/it-IT records
  remain source-owned; no translations were fabricated.

## Final validation evidence

- `audit-card-release-audit.mjs --strict`: exit 0; authored-side green; only 317 asset units remain.
- Release evidence consistency: 3,144 audited units, 63 open families, 89 members, zero errors.
- Canonical manifest: 5,024 cards / 3,226 units / zero implementation gaps / zero stale artifacts.
- Catalog sync: 3,226 modules, 5,024 exports, 16,829 printings; zero issues.
- Card test-quality audit: passed.
- Full workspace CI check: cards and engine type gates and complete suites passed.
- `vp run build`: types, cards, engine, catalog tooling, and scraper builds passed.

## Scoped audit commits

- `ecf0d2a62a` — scattered card audit wave
- `02d43d99f5` — content-addressed audit evidence and reconciliation
- `d793a4a408` — audited behavior gap fixes
- `38cb719c9b` — final evidence refresh

Unrelated shared-worktree edits and staging owned by other workers were preserved.
