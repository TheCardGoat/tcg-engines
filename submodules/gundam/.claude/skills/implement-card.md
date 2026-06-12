---
name: implement-card
description: Step-by-step playbook for implementing any Gundam TCG card (Unit, Pilot, Command, Base, Resource) in the engine. Covers loading rules context, scaffolding card data, understanding the structured effect, verifying engine support, writing tests, running them, and opening a PR. Always loaded when implementing or testing any card. Self-updates after each PR via the retrospective step.
user-invocable: true
argument-hint: "CARD_PATH=<path-to-card-file>"
---

## MANDATORY PREPARATION

Before doing any substantive work, run the `gundam-tcg-rules` skill (`.claude/skills/gundam-tcg-rules.md`) and keep its glossary in context for the full task. Load the matching reference files for every mechanic the card touches:

- `references/turn-structure.md` — setup, phases, end-of-turn
- `references/combat-and-battles.md` — attack steps, shields, Breach, First Strike, Suppression, Blocker
- `references/cards-and-keywords.md` — card types, keyword effects, pilot pairing, linking
- `references/deckbuilding-and-zones.md` — zone limits, resource management, hand limit
- `references/effects-and-resolution.md` — effect types, activation, resolution order, action steps
- `references/multiplayer.md` — only when relevant

Also keep `packages/types/src/card.ts` and `packages/types/src/effects.ts` in context — the structured effect schema is the contract the engine and card data both speak to.

---

# Implement a Card

- `CARD_PATH` = path to the card definition file, e.g. `packages/cards/src/cards/gd02/unit/003-gundam-mk-ii-titans.ts`
- `CARD_TYPE` is inferred from the path segment: one of `unit`, `pilot`, `command`, `base`, `resource`
- `SET` is inferred from the path segment: e.g. `gd01`, `gd02`, `st01`–`st06`, `beta`, `exbp`, `exrp`, `r`

---

## Step 1 — Load context

1. Run the `gundam-tcg-rules` skill and keep its glossary in context.
2. Read every relevant reference file for the mechanics the card touches (see Mandatory Preparation list).
3. Read the card files:
   - `${CARD_PATH}` — the card definition (raw `effect`, structured `effects[]`, stats, keywords)
   - `${CARD_PATH%.ts}.test.ts` — sibling test file (scaffold or existing tests)
4. Read a canonical reference test of the same `CARD_TYPE`:

   | CARD_TYPE  | Canonical reference test                                                  |
   | ---------- | ------------------------------------------------------------------------- |
   | `unit`     | `packages/cards/src/cards/gd02/unit/003-gundam-mk-ii-titans.test.ts`      |
   | `pilot`    | `packages/cards/src/cards/gd02/pilot/087-orga-crot-and-shani.test.ts`     |
   | `command`  | `packages/cards/src/cards/gd02/command/118-heart-set-on-revenge.test.ts`  |
   | `base`     | `packages/cards/src/cards/gd02/base/125-gwadan.test.ts`                   |
   | `resource` | Resources have no abilities — copy the simplest sibling and assert stats. |

5. If the card definition file does **not** exist yet (the card is missing from `packages/cards`), scaffold it first — see Step 1a.

### Step 1a — Scaffold via the parser (only if `CARD_PATH` is missing)

The parser emits a structured `effects[]` array, **but it is best-effort and must be hand-verified against the printed card text** before tests are written. Any non-trivial wording (conditional clauses, "if you do" chains, qualified pairings, target filters with `or` composition) is likely to need rewriting.

**Prerequisites:**

- `APITCG_KEY` environment variable must be set; the generator scripts hard-fail without it (`process.exit(1)`).

**Run** (from `tools/gundam-card-parser/`, via the repo's wrapped toolchain — do not invoke `pnpm`/`npm`/`yarn` directly per AGENTS.md):

```sh
vp run generate:units      # or :pilots, :commands, :bases, :resources
```

The generator scripts in `tools/gundam-card-parser/scripts/generate-*.ts` and the `effect-parser/` modules emit `cardNumber`, `name`, `traits`, `level`, `cost`, stats, `keywordEffects`, `effect` (raw), and a best-effort `effects[]`. **Always re-read the generated file** and reconcile the structured effect against `packages/types/src/effects.ts`.

---

## Step 2 — Understand the card

From the definition file, classify each entry in `effects[]`:

| Pillar            | Where it lives                     | What to look for                                                                                                                                                                                                                                                    |
| ----------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Card type**     | `card.type`                        | `unit` / `pilot` / `command` / `base` / `resource` — governs zones, fixture, and timing pool                                                                                                                                                                        |
| **Effect type**   | `effect.type`                      | `constant` / `triggered` / `activated` / `command` / `substitution`                                                                                                                                                                                                 |
| **Timing**        | `effect.activation.timing[]`       | `deploy`, `attack`, `destroyed`, `burst`, `whenPaired`, `duringPair`, `whenLinked`, `duringLink`, `main`, `action`, `activate:main`, `activate:action`, `onEnemyEffectDamage`, `onApReducedByEnemy`, `onExResourcePlaced`, `onEnemyLinkUnitDestroyed`, `whenHealed` |
| **Qualification** | `effect.activation.qualification`  | `AttributeFilter` predicate gating activation (e.g. `level ≤ 3` for "Lv.3 or Lower Pilot")                                                                                                                                                                          |
| **Conditions**    | `effect.activation.conditions[]`   | Read-only board-state checks — see the `EffectCondition` union                                                                                                                                                                                                      |
| **Restrictions**  | `effect.activation.restrictions[]` | `oncePerTurn` / `optional`                                                                                                                                                                                                                                          |
| **Cost**          | `effect.cost`                      | `restSelf`, `payResources`, `discardCount`, `restFriendlyUnits`, `destroySelf`                                                                                                                                                                                      |
| **Directives**    | `effect.directives[]`              | Each is `EffectDirective` (with `action`, `optional`, `dependsOnPrevious`) or `ConditionalDirective` (`condition` + `thenDirectives` + `elseDirectives`)                                                                                                            |
| **Keywords**      | `card.keywordEffects[]`            | `Repair`, `Breach`, `Support`, `Blocker`, `FirstStrike`, `HighManeuver`, `Suppression` (+ optional numeric param)                                                                                                                                                   |
| **Pilot keyword** | `effect.pilotKeyword`              | Command-only: `【Pilot】[Name]` restriction                                                                                                                                                                                                                         |

Let card text override base rules wherever they conflict (Rule 1-3). When the `effect` raw text and the structured `effects[]` disagree, **trust the rules-correct interpretation and rewrite `effects[]`** — do not pin the engine to a parser bug.

---

## Step 3 — Identify what engine support exists

**Before writing tests**, grep the engine for each `EffectAction`, `EffectTiming`, and `EffectCondition` the card uses. If anything is missing, implement the engine behaviour first, then write tests.

Places to check:

- `packages/engine/src/gundam/effects/executor.ts` — directive resolution loop
- `packages/engine/src/gundam/effects/handlers/` — per-action handlers (one file per `EffectAction`)
- `packages/engine/src/gundam/effects/event-timings.ts` — timing → engine event mapping
- `packages/engine/src/gundam/effects/deploy-triggers.ts` — `deploy` enqueue path
- `packages/engine/src/gundam/effects/pending-effects.ts` — pending choice / queue plumbing
- `packages/engine/src/gundam/lifecycle/**` — phase logic (start, draw, resource, main, battle, end)
- `packages/engine/src/gundam/moves/core/` — player moves (deploy, attack, pair, activate, etc.)

### Known engine patterns and gaps

- **`enqueueOwnCardTriggers(G, event, sourceCardId, ownerId, framework)`** is the test-friendly enqueue path. It runs the qualification + condition gate before pushing onto `G.pendingEffects`. Tests that simulate a trigger should call it from a `runTestMutation` and then assert `G.pendingEffects.length`.
- **`resolveQualificationActorId` mapping**: the actor whose attributes are checked against `effect.activation.qualification` depends on the event. For `unitDestroyed`, the actor is `event.cardId` (the dying unit) — **not** the paired pilot. This is a deliberate fail-closed contract; cards whose printed text implies the paired pilot's level need a dedicated card-data follow-up. See `gd02-003` test for the canonical example.
- **`duringPair` / `duringLink` continuous gates**: not a trigger event — they short-circuit other timing checks while the pairing/link condition holds. Verify `G.pilotAssignments[unitId]` is set in fixtures before asserting `duringPair` effects fire.
- **`【Burst】` resolution**: triggers from shield flip (`burst` timing). The defending player chooses to activate. Routed through `pending-effects` as a player-prompted choice, not auto-resolved.
- **`【Destroyed】` event**: emits `unitDestroyed` with `event.cardId = destroyedUnit`. Pilots paired to the destroyed unit travel to trash with the unit (Rule: pilots move with their linked unit). Test both that the trigger fires AND that the paired pilot follows.
- **`AttributeFilter` with `or` composition**: outer `attributeFilters[]` is ANDed; an inner `{ attribute: "or", filters: [...] }` provides logical OR. Use this for "(Zeon) OR (Neo Zeon) Unit with Lv.4 or lower" — two ANDed entries, the first an `or` block.
- **`SourceStatRef` (`{ ref: "source", stat }`)**: the RHS of a numeric `AttributeFilter` can reference the source card's own stat. For pilot-resident effects, "this Unit" refers to the **paired unit** (Rule 3-3-9-1) — `buildTargetResolutionContext` rebinds `ctx.selfIdentityCardId` to the paired unit. Tests must pair the pilot before exercising these filters.
- **`isBattling` filter**: `true` matches combatants in `pendingCombat`; on direct attacks the defender's `baseSection` (if any) or `shieldArea` cards also match. The object form `{ opponentMatches: <sub-filter> }` filters by the _opponent_ in the current battle. No combat in progress ⇒ `true` matches nothing, `false` matches everything.
- **`lookAtTopDeck.remainingDestination`**: use this when the printed text says "return 1 to the top" and sends the unchosen revealed cards somewhere specific. For Minerva-style text ("Place the remaining card into your trash"), encode `action: "lookAtTopDeck", return: "chooseTop", remainingDestination: "trash"`. When this field is set, the auto-resolver keeps the first revealed/remaining card on top and moves the rest to the destination; when omitted, legacy tutor-style effects return all non-tutored cards to the deck bottom.
- **Card-name substring targets**: printed text like `with "Impulse Gundam" in its card name` should use `AttributeFilter { attribute: "name", comparison: "includes", value: "Impulse Gundam" }`, not exact equality.
- **`returnToDeck` action**: use for costs/effects that return a card to the owner's deck (`position: "top" | "bottom"`). For "return this Unit to the bottom of its owner's deck" encode a self-targeted `returnToDeck` directive before the follow-up directive. Counted later directives still get target selection through `activateAbility` / `resolveEffect`.
- **`dependsOnPrevious` directive flag**: encodes "If you do, ..." chains. Skips when the immediately-preceding directive did not resolve. Targeted actions count as "not resolved" if no legal target was picked; optional actions count as "not resolved" if declined. Zone-level non-targeted actions (`draw`, `discard`, `addSelfToHand`, `lookAtTopDeck`, …) are always reported resolved — model finer-grained gating with an explicit `EffectCondition` instead.
- **`costReduction` action**: NEVER pushed into `G.continuousEffects` — consumed by `computeEffectiveCostInHand` directly. Tests assert effective cost, not queue contents.
- **`millDeck` action**: clamps `count` to the remaining deck size; `owner: "any"` is treated as `"self"` (only included for union parity).
- **`activate:main` / `activate:action` activated abilities**: payment goes through the `activateAbility` move (or its Gundam equivalent in `moves/core/`); they do NOT auto-fire from `enqueueOwnCardTriggers`. Verify a move exists before writing a test that triggers them.
- **`pendingEffects` validation**: cards with no resolvable target must not enqueue. The pre-enqueue gate runs both `qualification` and `conditions[]`; the executor additionally pre-checks each directive's targets before paying costs.

### Constant cost-reduction & stat modifiers

These are evaluated dynamically — they are **NOT** stored as `continuousEffects` entries.

1. `costReduction` → `computeEffectiveCostInHand` (`packages/engine/src/gundam/...`). Test by asserting the effective cost in hand, not by inspecting any continuous-effects array.
2. `statModifier` with `duration: "permanent"` on a constant-timing effect → resolved at stat-read time. Tests should read the unit's effective AP/HP via the engine's stat accessor, not raw card definition stats.
3. `preventDamage` / `preventStatReduction` / `preventDamageToZone` → consulted at damage/stat-mutation time. Verify the engine consults them in `lifecycle/battle-phase/**`.

---

## Step 4 — Write the tests

**Run the `gundam-test-generation` skill (`.claude/skills/gundam-test-generation.md`) and follow it for every test you author or modify.** It is the single source of truth for test syntax, naming, mandatory coverage, and which engine helpers to use; this section only covers card-type-specific fixture nuances on top of that.

Replace the scaffold body. Structure the file as **one `describe` block per ability**, with the printed rules text as the `describe` label. Inside each block, cover:

| Scenario             | What to assert                                                                                     |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| Happy path           | Trigger fires, `pendingEffects` populates, resolution updates state                                |
| Qualification gating | When `qualification` fails, the effect does **not** enqueue (assert `pendingEffects.length === 0`) |
| Condition gating     | Each `EffectCondition` evaluated true vs. false                                                    |
| Negative path        | Illegal move / no legal target / cost cannot be paid                                               |
| Side effects         | Cards moved between zones, stats changed, costs paid, `pilotAssignments` updated                   |
| `dependsOnPrevious`  | When previous directive does not resolve, dependent directive skipped                              |
| Keyword interactions | If card has `<Blocker>` / `<Breach>` / etc., assert the combat-side effect                         |

> **Data-shape tests are an escape hatch, not a default.** See `gundam-test-generation` → "When data-shape tests ARE allowed". Add one only when the engine cannot exercise the behavior end-to-end (e.g. `gd02/118-heart-set-on-revenge`, `gd02/003-gundam-mk-ii-titans`), and pair it with a behavior test or a clearly-labelled blocker `it.skip(...)`.

Add at least **8 meaningful tests** beyond the scaffold. Note the baseline test count before starting.

### Fixture rules — by card type

#### Unit

- **Pre-placed in battle area**: `GundamTestEngine.create({ play: [unit] }, {})` → `engine.asPlayer(P).getCardsInZone("battleArea")[0]`.
- **Paired with a pilot** (for `duringPair` / `whenPaired`): place the unit and pilot as real card instances and pair via the normal API (prefer `engine.assignPilot(...)` or the equivalent move). `pilotAssignments` is keyed by unit **instance id** and stores the pilot **instance id**, not `cardNumber`. If a test must mutate state directly inside `runTestMutation`, store the registered pilot instance id (e.g. the id moved into `battleArea`), not `pilot.cardNumber`. Use `createMockPilot({ level })` to build pilots with the qualifying level. Storing `cardNumber` works only for "truthy" gating — link checks and `SourceStatRef` rebinding will break.
- **Linked unit (`isLinkUnit`)**: pair with a pilot whose printed link condition matches the unit. Linked units enter ready and may attack the turn they enter.
- **Summoning sickness**: a unit deployed via `deploy` enters rested-active-but-can't-attack-this-turn unless linked. Test by attempting an attack on the same turn and asserting failure.

#### Pilot

- **In hand, paired via `pairPilot`**: `hand: [pilot]` + a target unit on the field. Pay `cost`, resolve the `pairPilot` action, then assert `G.pilotAssignments[unitId]` equals the paired pilot's **instance id** (the id now in `battleArea`) — never compare against `pilot.cardNumber`.
- **Pilot-resident effects**: when testing a pilot's effect, "this Unit" rebinds to the paired unit. Always pair before exercising the effect.
- **Burst on a pilot in shield area**: shields are dealt face-down at setup; flip via combat damage to fire `burst`. For unit tests, place the pilot directly in `shieldArea` and trigger a flip.

#### Command

- **Main vs. Action timing**: `main` plays during Main Phase only; `action` plays during Action Step (between attack steps). Fixture must advance to the right phase.
- **Burst** clauses on Commands route through shield flip — same as pilot Burst. Mind the `addSelfToHand` / `activateTiming` / `deploySelf` action variants, which are universal Burst clauses.
- **Pilot-keyword Commands** (`effect.pilotKeyword`): printed as `【Pilot】[Name]`. The card can additionally be played as a pilot pairing — test both modes.

#### Base

- **`baseSection` is single-slot**: only one Base may occupy it per player. Replacing one trashes the previous.
- **Bases absorb damage on direct attacks first** (Rule 8-5-2-1): direct-attack damage routes through Base HP before reaching shields. Tests for `isBattling` filters on Base cards must construct a direct-attack scenario.

#### Resource

- Resources have no abilities, no color, no AP/HP. Tests assert stats and that the card is constructable into a resource deck.

### Cross-type fixture rules (apply to all)

- Card defs may appear in only one player's fixture.
- `pilotAssignments` is keyed by **unit instance id**, not card number — read the id from `getCardsInZone` after fixture creation.
- A pilot leaving play (unit destroyed, returned to hand, exiled) drops its `pilotAssignments` entry. Assert this on `unitDestroyed` tests.
- Tokens are removed from the game when they leave a valid zone. Token-deploy tests should assert removal on destroy/return.
- **Zone caps are zone-specific** in both rules and engine — do **not** assume all over-cap effects silently no-op:
  - **Resource Area** (cap 15): the engine no-ops placement once capped. Assert no additional resource is created/moved when already at 15.
  - **Hand** (cap 10): not enforced at draw/add time; enforcement happens via end-phase discard-to-hand-limit. Test the end-phase flow when an effect can leave a player over 10 cards.
  - **Battle Area** (cap 6 units): the rules say excess units are sent to trash, but the current engine does **not** enforce overflow at deploy time. Document the gap when relevant; write tests against the engine's actual behaviour unless the task is specifically to implement the rule.
- Active player resolves first in simultaneous choices. Multi-player simultaneous triggers test the active-player ordering explicitly.

### TestEngine conventions

| Convention                                                     | Detail                                                                                       |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `GundamTestEngine.create(p1Fixture, p2Fixture)`                | Two-arg constructor; pass `{}` for an empty side                                             |
| `engine.asPlayer(PLAYER_ONE).getCardsInZone(zone)`             | Returns instance ids; index `[0]` for single-card fixtures                                   |
| `engine.getRuntime().runTestMutation(playerId, fn)`            | Executes `fn({ G, framework })` inside a mutation; only path to mutate `G` directly in tests |
| `enqueueOwnCardTriggers(G, event, sourceId, owner, framework)` | Synthetic event enqueue used in unit tests. Runs the qualification + conditions gate.        |
| `createMockPilot({ level, traits?, color? })`                  | Builds a `PilotCard` for pairing tests without depending on a real card                      |
| `PLAYER_ONE` / `PLAYER_TWO`                                    | Imported from `@tcg/gundam-engine`                                                           |
| `import { describe, it, expect } from "vite-plus/test"`        | Never import from `vitest` directly                                                          |
| Reusable assertions                                            | Belong on `GundamTestEngine` as a method, not as a test-local helper                         |

When asserting "no effect enqueued", read `G.pendingEffects.length` inside the same `runTestMutation` that triggered the event — `G` outside the mutation is a stale snapshot.

---

## Step 5 — Run and iterate

```sh
vp test packages/cards --run
vp test packages/engine --run
```

Fix failures. Do not move on until **all tests pass**. Confirm the new test count exceeds the pre-implementation baseline by at least 8.

Then run repo-wide gates:

```sh
vp check
```

---

## Step 6 — Retrospective (self-update this skill)

Answer each question. For any answer that reveals a new pattern, edge case, or constraint, **edit this SKILL.md file directly** to incorporate it. That is the virtuous loop — each card either confirms existing patterns (the prompt stays tight) or reveals a new constraint (the prompt absorbs it).

Questions:

1. Was any `EffectAction`, `EffectCondition`, or `EffectTiming` variant missing? → document the detection pattern under Step 3.
2. Was `resolveQualificationActorId` missing a mapping for a new event? → add the mapping note.
3. Did the parser produce a wrong `effects[]` shape that needed hand rewriting? → note the parser limitation in Step 1a.
4. Did any fixture constraint cause a surprising failure? → add it to the matching card-type section in Step 4.
5. Was a new `GundamTestEngine` helper needed? → add it to the conventions table.
6. Did a rules question arise that the `gundam-tcg-rules` skill didn't answer? → flag it for that skill (separate update).
7. Was there a per-target / per-source condition that needed special handling beyond the generic evaluator? → document the pattern.
8. Did this card type reveal fixture or zone behaviour not yet covered? → add a new sub-section.

**After editing, commit the updated SKILL.md** with message: `docs(skills): update implement-card playbook after {Card Display Name} ({CARD_NUMBER})`.

---

## Step 7 — Make a PR

- **Branch**: `feat/implement-{set}-{nnn}-{slug}` (e.g. `feat/implement-gd02-003-gundam-mk-ii-titans`)
- **Commit message**: `feat(engine): implement {Card Display Name} ({CARD_NUMBER})`
- **PR description** must include:
  - Card type, set, and which abilities are covered
  - Which engine operations were added or reused
  - Any rules-interpretation calls made when card text and base rules conflicted
