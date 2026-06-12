---
name: "lorcana-cards"
description: "Single owner for everything related to a specific Disney Lorcana card in `packages/lorcana/lorcana-cards` \u2014 authoring, debugging, triaging, generating, and any bounded engine or types extension required to make the printed text work. Use whenever the unit of work is \"this card\"."
---

# Lorcana Cards

This skill owns the full lifecycle of a single card: from printed text to passing test, including bounded extensions to `lorcana-engine` and `lorcana-types` when the card requires them. There is no separate "engine-extend" skill for card-driven gaps. If a card needs the engine to do something new, that work lives here.

Use this skill when the unit of work is **a specific card**. For cross-cutting engine work (new variant unsupported by _any_ card), follow the engine-package conventions in [`packages/lorcana/lorcana-engine/AGENTS.md`](../../../packages/lorcana/lorcana-engine/AGENTS.md) directly.

## Required Memory Step

1. Read [`memory/schema.md`](./memory/schema.md). It is the canonical schema shared across all Lorcana skills.
2. Read the **Guardrails** and **Promoted Rules** sections of [`memory/bank.md`](./memory/bank.md).
3. Apply guardrails before editing. After substantive work, follow the schema's Memory Update Protocol.

## Scope and Boundaries

Owned by this skill:

- Authoring the card definition file (`{NUMBER}-{slug}.ts`).
- Authoring or activating the test file (`{NUMBER}-{slug}.test.ts`).
- Bounded engine/types extensions when a single card needs them.
- Classifying whether a failing card is an authoring, engine, stub, or test-surface problem.
- Maintenance of `missingImplementation` / `missingTests` flags.

Not owned by this skill (escalate or use sibling skills):

- Generating brand-new test patterns from scratch with no card context → [`lorcana-test-generation`](../lorcana-test-generation/SKILL.md) (provides harness reference; this skill orchestrates).
- Resolving rules ambiguity → [`lorcana-rules`](../lorcana-rules/SKILL.md). Consume its Mode B JSON; do not reason about CR text inline.
- Card identity lookup and similar-card retrieval → [`lorcana-find-card`](../lorcana-find-card/SKILL.md). Always pass `k` explicitly.
- Cross-cutting engine refactors that span many cards or add a new variant family → engine-package owners; create a minimal repro and hand off.

## The Loop (canonical workflow)

```
Resolve → Ground → Probe → Author → Test → Verify
                                         ↓ on failure
                                      Triage → (back to one of the above)
```

### 1. Resolve

```bash
bun packages/lorcana/lorcana-cards/src/cards/similarity.ts \
  --query "<card>" --limit 10
```

Pass `k` (here `--limit`) explicitly. Default is 10. If `status: "ambiguous"`, ask the user to choose; never guess. Capture: definition path, test path, top-`k` similar cards filtered to active-test references only.

### 2. Ground

If the printed text touches a non-trivial rule (timing, replacement, alternate cost, multiplayer interaction), ask `lorcana-rules` for **Mode B** JSON. Use its `behaviorConstraints` and `testImplications` to drive authoring and assertions. Carry the citations into the test file as a top-of-file comment.

If the text is unambiguous (vanilla stats, plain keyword, simple "deal N damage"), skip grounding.

### 3. Probe

Run the **support-probe** before declaring an engine gap. It walks a proposed ability shape and reports which referenced variants are registered:

```bash
bun packages/lorcana/lorcana-engine/src/support-probe/cli.ts \
  --ability '{"type":"triggered","trigger":{"event":"play","on":"SELF"},"effect":{...}}'
```

Or programmatically: `import { probeSupport } from "@tcg/lorcana-engine/support-probe"`.

Exit code `0` = all referenced variants supported; `1` = at least one missing/unknown. Output is JSON with per-surface checks (`effect`, `condition`, `target`, `trigger-event`, `trigger-subject`) and the registry each was checked against.

For deeper investigation when the probe flags `missing`, consult the source:

- Effect resolvers: `packages/lorcana/lorcana-engine/src/runtime-moves/resolution/action-effects/`
- Activated abilities: `packages/lorcana/lorcana-engine/src/runtime-moves/moves/abilities/activate-ability.ts`
- Triggered: `packages/lorcana/lorcana-engine/src/triggered-abilities/index.ts`
- Derived state and projection: `packages/lorcana/lorcana-engine/src/rules/derived-state.ts`, `packages/lorcana/lorcana-engine/src/projection`
- Variant registries: `ACTION_EFFECT_RESOLVER_TYPES`, `CONDITION_VARIANT_TYPES`, `TARGET_VARIANT_TYPES`

A claimed engine gap must reduce to one named registry entry or one named resolver. Anything vaguer is not yet a gap — keep probing. Note that the probe is structural (registered ≠ correct end-to-end runtime); it answers "is this discriminator handled at all", not "does this exact ability run cleanly".

### 4. Author

Reference: [`PATTERNS.md`](./PATTERNS.md) for DSL shapes; [`packages/lorcana/lorcana-cards/AGENTS.md`](../../../packages/lorcana/lorcana-cards/AGENTS.md) for ability-type conventions. Do not duplicate those tables here.

Hard rules:

- Implement from printed text, not from a stale generated stub.
- If a bounded engine/types extension is needed, do it in the same task. Add or extend the per-variant test in `lorcana-engine` (see engine AGENTS.md) so the extension is registry-tracked.
- Only leave `missingImplementation: true` after Probe identifies an unbounded gap and you can name the exact unsupported registry entry.
- Enchanted/epic variants share `canonicalId` and copy abilities verbatim from the base card.

### 5. Test

Use the harness reference in [`lorcana-test-generation`](../lorcana-test-generation/SKILL.md). Hard rules:

- One active behavior test per printed clause.
- Tests asserting only `missingImplementation`, `missingTests`, or empty `abilities` arrays do not count as coverage.
- Prefer semantic matchers (`toHaveZoneCounts`, `toHaveKeyword`, `toBeAtLocation`) over raw state reads.
- Hidden-zone, under-card, and chooser flows require authoritative state assertions, not client snapshots.

### 6. Verify

```bash
bun test --cwd packages/lorcana/lorcana-cards "./src/cards/<SET>/<TYPE>/<NUMBER>-<slug>.test.ts"
bun run --cwd packages/lorcana/lorcana-cards check-types
```

Widen scope only when the change touched shared engine code:

- Engine variant tests for any registry entry you extended.
- Card-side neighbors that reuse the same resolver/helper.

### Triage (on failure)

Classify the failure into exactly one bucket before changing code:

| Bucket         | Signal                                                         | Next step                                                                            |
| -------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `AUTHORING`    | Wrong DSL shape, owner scope, duration, or missing-flag        | Fix the card file; rerun                                                             |
| `ENGINE_GAP`   | Probe identifies a missing registry entry or resolver branch   | Bounded extension in same task                                                       |
| `STUB_QUALITY` | Generated file is structurally wrong (parser/generator output) | Fix the generator if blocker repeats; otherwise hand-author and flag in observations |
| `TEST_SURFACE` | Empty file, legacy comments, keyword-smoke-only                | Replace with active test using current harness                                       |

If the same `ENGINE_GAP` appears twice in one batch, stop and fix the shared support before continuing. Repeating an engine fix per card is a smell.

## False-Green Signals

Treat as migration debt, not as healthy:

- Empty `.test.ts` file.
- Test entirely commented `// LEGACY IMPLEMENTATION`.
- Single keyword smoke check (Ward, Evasive, Bodyguard, Support).
- Client-side success without authoritative-state confirmation on hidden-zone, under-card, or chooser paths.
- Generated stub that compiles but still has `missingImplementation: true`.

## Decision tree (collapsed)

```
Card has text and no abilities?              → Author (Step 4) after Probe
Card has abilities and failing test?         → Triage: AUTHORING vs ENGINE_GAP
Card has empty/legacy test only?             → TEST_SURFACE: write active test
Card claims missingImplementation: true?     → Probe; if extension is bounded, do it
Same blocker hits 2+ cards in a batch?       → Stop; fix shared engine support
Printed text is rules-ambiguous?             → Ground via lorcana-rules first
```

## Generation and Parser Tooling

The package contains parser and generator scripts. Inspect generated files when:

- A card looks machine-generated and structurally inconsistent with adjacent cards.
- Repeated malformed stubs suggest the generator, not the cards.
- Parser/text-shape normalization is the real blocker.

```bash
bun run --cwd packages/lorcana/lorcana-cards generate
bun run --cwd packages/lorcana/lorcana-cards generate-cards:all --skip-fetch
bun run --cwd packages/lorcana/lorcana-cards fetch
```

Do not paper over generator gaps with one-off card hacks. Either fix the generator or escalate.

## Reusable Prompts

See [`PROMPTS.md`](./PROMPTS.md).

## Companion files

- [`PATTERNS.md`](./PATTERNS.md) — DSL/effect/target shape reference (single source of truth for this skill).
- [`COMMON_ISSUES.md`](./COMMON_ISSUES.md) — failure-mode taxonomy used by Triage.
- [`PROMPTS.md`](./PROMPTS.md) — reusable request templates.
- [`memory/schema.md`](./memory/schema.md) — canonical memory schema (referenced by sibling skills).
- [`memory/bank.md`](./memory/bank.md) — live tiered memory store.
