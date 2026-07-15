# Lorcana Test Generation Memory Bank

Schema: [`schema.md`](./schema.md) (extends canonical [`../../lorcana-cards/memory/schema.md`](../../lorcana-cards/memory/schema.md)). Demoted/expired entries: [`archive.md`](./archive.md).

## Guardrails

- **G-01**: Default to `LorcanaMultiplayerTestEngine`. Use `LorcanaTestEngine` only for narrow keyword/model checks. Why: gameplay-flow tests exercise priority and bag handling that the simple engine ignores. Applies: every new test file.
- **G-02**: One active behavior test per printed clause. No metadata-only tests counted as coverage. Why: metadata snapshots hide regressions. Applies: review and authoring.
- **G-03**: For hidden-zone, under-card, or chooser flows, use authoritative server state, not client snapshots. Why: client-side success can be optimistic and mask runtime failures. Applies: any test touching hidden state.
- **G-04**: Prefer semantic matchers (`toHaveZoneCounts`, `toHaveKeyword`, `toBeAtLocation`, `toHavePendingEffectCount`) over raw state reads. Why: matcher receivers and signatures are typed; raw reads drift silently. Applies: assertions.
- **G-05**: When `lorcana-find-card` is needed, always pass `k` explicitly (default 10). Why: implicit defaults drift across skills. Applies: every similar-card lookup.

## Promoted Rules

### PR-01 — characters-default-to-drying

- **claim**: Characters placed in play via fixture are drying by default. Set `isDrying: false` if the test needs them to quest, challenge, or activate immediately.
- **scope**: Fixture authoring for any character that acts in the same setup turn.
- **evidence**: documented in `SKILL.md` Pitfalls; consistent across all set-001..005 item/character batches.
- **verification**: any existing active character test under `packages/lorcana/lorcana-cards/src/cards/<SET>/characters/`.
- **last_checked**: 2026-04-27

### PR-02 — defenders-must-be-exerted-for-challenge

- **claim**: Defenders must be `exerted: true` for characters to challenge them; the rule applies in fixture setup, not just at runtime.
- **scope**: Challenge tests.
- **evidence**: section-04 challenge specs and all challenge-shape card tests.
- **verification**: `bun test packages/lorcana/lorcana-engine/src/__tests__/section-04-06.test.ts`
- **last_checked**: 2026-04-27

## Candidates

### C-01 — scaffolder-needed

- **pattern**: Test files repeatedly invent harness API at the margin (wrong matcher receiver, wrong cost-key shape). A typed scaffolder (`lorcana-test-scaffold`) would cap the surface.
- **hits**: 1 (most recent: 2026-04-27, infrastructure observation)
- **promote_when**: scaffolder exists and is referenced in a test; until then, this is a tooling proposal, not a rule.
- **demote_at**: 2026-06-26

## Observations

(none — initial state.)
