---
name: implement-card
description: Step-by-step playbook for implementing any Cyberpunk TCG card (Legend, Unit, Program, Gear) in the engine. Covers loading rules context, understanding the card definition, verifying engine support, writing tests, running them, and opening a PR. Always loaded when implementing or testing any card. Self-updates after each PR via the retrospective step.
user-invocable: true
argument-hint: "CARD_FILE=<card-file-stem>"
---

## MANDATORY PREPARATION

Before doing any substantive work, run `./.agents/skills/cyberpunk-tcg-rules` (or `./.codex/skills/cyberpunk-tcg-rules`) and keep its glossary in context for the full task. Load the matching reference files for every mechanic the card touches.

---

# Implement a Card

- `CARD_TYPE` = one of `legends`, `units`, `programs`, `gear`
- `CARD_FILE` = the card's file stem (e.g. `v-corporate-exile`, `jackie-welles-pour-one-out-for-me`)

---

## Step 1 — Load context

1. Run the `cyberpunk-tcg-rules` skill and keep the full glossary in context.
2. Read the relevant reference files for every mechanic the card uses:
   - `references/turn-structure.md` — setup, phases, overtime
   - `references/combat-and-gigs.md` — Gigs, Street Cred, attacking, blocking
   - `references/cards-and-keywords.md` — card types, keywords, triggers
3. Then read:
   - `packages/cards/src/alpha/{CARD_TYPE}/{CARD_FILE}.ts` — abilities, keywords, costs, power
   - `packages/engine/src/alpha/{CARD_TYPE}/{CARD_FILE}.test.ts` — scaffold to fill in
   - A reference implementation of the same card type (see table below)

| CARD_TYPE  | Canonical reference test                                                |
| ---------- | ----------------------------------------------------------------------- |
| `legends`  | `packages/engine/src/alpha/legends/goro-takemura-hands-unclean.test.ts` |
| `units`    | Nearest existing unit test with a similar ability shape                 |
| `programs` | Nearest existing program test with a similar ability shape              |
| `gear`     | Nearest existing gear test with a similar ability shape                 |

---

## Step 2 — Understand the card

From the definition file, identify every ability and classify it:

| Type                              | What to look for                                                               |
| --------------------------------- | ------------------------------------------------------------------------------ |
| **Card type**                     | `legend`, `unit`, `program`, `gear` — governs zones, timing, and fixture setup |
| **Power**                         | Present on Legends and Units; absent on Programs; on Gear it buffs the host    |
| **Keywords**                      | `GO SOLO`, `BLOCKER` → rules from the skill (Legends and Units only)           |
| **Triggered abilities**           | trigger event, `firstTimeEachTurn` limits, effects                             |
| **Static abilities**              | kind: `"static"`, duration, conditions, targets, value; no trigger             |
| **Classifications**               | e.g. `Arasaka`, `Merc` → may affect other cards' abilities                     |
| **Attachment target** (Gear only) | Which units or legends this Gear can attach to                                 |

Let card text override base rules wherever they conflict.

---

## Step 3 — Identify what engine support exists

**Before writing a single test**, grep for each ability's trigger/effect type in the engine to confirm it is already implemented. If it is not, implement the engine behaviour first, then write tests.

Places to check:

- `packages/engine/src/moves/` — move-level hooks
- `packages/engine/src/operations/` — effect primitives
- `packages/engine/src/types/game-events.ts` — existing event types
- `packages/engine/src/ability-executor.ts` — generic event-trigger pipeline (handles `firstTimeEachTurn` limits, binding resolution, optional effects, conditional effects); hooked into `play-card.ts` after the `cardPlayed` event

### Known engine patterns and gaps

- **Event-typed triggers** (`cardPlayed`, `gigStolen`, etc.) are processed by `ability-executor.ts`. The `processEventTriggers(...)` call must exist in the relevant move handler — it is currently hooked into `play-card.ts`, `call-legend.ts`, `attack-unit.ts`, `attack-rival.ts`, and `resolve-attack.ts`. If a new event type needs triggering from a different move, add the call there.
- **`flip` triggers require `legendFlipped` processing**: `call-legend.ts` calls `processEventTriggers` for both `legendFlipped` (fires `flip` triggers) and `legendCalled` (fires `call` triggers) events, in that order. If a legend has a `flip` trigger, the `legendFlipped` event processing is what activates it — not `legendCalled`.
- **DSL event name vs. engine event type**: Card definitions use DSL event names (e.g. `cardAttacks`) that differ from engine `GameEvent` types (e.g. `attackDeclared`). The mapping lives in `EVENT_TYPE_TO_DSL` in `triggers/index.ts`. Direct triggers (`call`, `flip`, `defeated`) are matched directly by `matchTriggers` in `triggers/index.ts` via the targeted pass (switch cases). When adding new event-based triggers, add entries to these maps.
- **`defeated` trigger** (`cardDefeated` event): `resolve-attack.ts` emits `cardDefeated` AND calls `processEventTriggers` immediately after. `passesEventFilter` returns `true` for non-"event" triggers (play, attack, etc.) so they pass through after `matchTriggers` pre-selects them.
- **Bindings must be satisfied before costs are paid**: `processEventTriggers` skips any ability whose required bindings return no targets. Effects are also pre-checked for targets before costs are paid. This prevents unwanted spending when there is no valid target.
- **`ability.costs` is processed by `processEventTriggers`**: Spend costs are validated (card not already spent) and paid before executing effects.
- **`firstTimeEachTurn` limit** tracking lives in `TurnMetadata.abilityFiredThisTurn[]`; it is cleared by `resetTurnFlags` at turn end.
- **`evaluateCondition` for `targetValue: { value: "max" }`** compares the die's face value against `DIE_MAX_VALUES[die.dieType]` (the die type's structural maximum, not the current game-wide max).
- **`handleModifyGig`** clamps the result to `[1, DIE_MAX_VALUES[dieType]]`.
- **`playCard` effect from triggered abilities**: Creates a `chooseCardToPlay` pending choice. Resolve it with `engine.resolveCardToPlay(gear)`. The bound `attachTo` target is resolved eagerly and stored as `resolvedAttachToId` in the pending choice payload. New move `resolveCardToPlay` handles the resolution.
- **`hasAttachedCards: false` target filter**: The engine correctly handles this to find cards with NO attached gear. Used in bindings for "equip to unit with no gear" abilities.
- **`activated` trigger (spend abilities)**: Cards with `trigger: { trigger: "activated" }` and `costs: [{ cost: "spend" }]` are spend-activated abilities. These are NOT handled by `processEventTriggers` — they require the `activateAbility` move (`packages/engine/src/moves/activate-ability.ts`). The move validates the card is face-up (for legends), can pay costs, then executes the ability's effects. Test with `engine.activateAbility(card, abilityIndex)`.
- **`searchDeck` effect**: Creates a `searchDeck` pending choice. Resolve it with `engine.resolveSearchDeck(selectedCards)` (pass an array of card refs to add to hand, or `[]` to select nothing). The move validates selected cards match the target filter (card type, classifications, `maxCost`) and are within the look window. Non-selected cards are bottom-decked. The `resolveSearchDeck` move lives in `packages/engine/src/moves/resolve-search-deck.ts`.
- **Deck fixture for search tests**: Use `deck: 20` to ensure enough cards remain after the 6-card opening draw. Use `engine.patchState()` or `engine.judgeMoveCardToTopOfDeck()` to position specific cards at the top of the deck before activating search abilities.
- **`getLastActionLog()` may not return the expected log when a flip trigger fires searchDeck**: The `callLegend` → `flip` trigger → `searchDeck` pipeline emits multiple action logs (`move.callLegend`, then `move.searchDeck.reveal`). Use `engine.getEvents("actionLog")` and filter by `messageKey` instead of relying on `getLastActionLog()` for the call log.
- **`gigStolen` event triggers**: `resolve-attack.ts` now calls `processEventTriggers` for each `gigStolen` event after gig stealing. The event carries `sourceCardId` (the attacker). `passesEventFilter` handles `gigStolen` with `player` (friendly/rival based on `toPlayerId`) and `source: { selector: "self" }` (matches `event.sourceCardId` against the ability card's instanceId). The `moveGig` operation accepts an optional `sourceCardId` parameter.
- **`ifYouDo` + `removeFromGame` with `optional: true`**: When `removeFromGame` is the `doEffect` inside `ifYouDo` and has `optional: true`, the engine auto-executes it (removes the card). The `optional` flag does not create a player confirmation choice — it auto-resolves. The `ifEffects` then fire (e.g. `playCard` from trash).
- **Direct attack resolution requires 3 `resolveAttack` calls**: The flow is: (1) `resolveAttack()` (P1, offensive → defensive), (2) `resolveAttack({ as: P2, pass: true })` (P2, defensive → resolve), (3) `resolveAttack()` (P1, resolve: execute steal/fight).
- **`cardAttacks` trigger `target` filter (classifications, cardTypes)**: `passesEventFilter` checks the `target` property on `cardAttacks` triggers, filtering by `target.cardTypes` and `target.classifications` against the attacking card's definition. This ensures triggers like "when a friendly Arasaka unit attacks" only fire for matching units.
- **`discardFromHand` effect**: Creates a `chooseTarget` pending choice (with `payload.type: "discardFromHand"`) when `amount > 1` or hand has more cards than the amount. In the current engine behavior, this means a pending choice is still created when `hand.length === amount` and `amount > 1`; it only auto-resolves when there is no actual selection to make (for example, a single-card discard with exactly one card in hand). Resolve the pending choice with `engine.resolveDiscardFromHand(cards)`. The move lives in `packages/engine/src/moves/resolve-discard-from-hand.ts`.
- **Conditional effects (effect.conditions)**: `executeAbilityEffects` evaluates `effect.conditions` before each effect. If any condition fails, the effect is skipped. For example, `discardFromHand` with a `streetCred` condition only fires when the player's Street Cred meets the threshold.

### Static `modifyPower` continuous abilities (kind: `"static"`, no trigger)

These are evaluated dynamically — they are **NOT** stored as `continuousEffects`.

1. Check `packages/engine/src/static-effects/index.ts` for `computeStaticPowerModifier`. If the function or the relevant branch is absent, implement it before writing tests.
2. Check `packages/engine/src/moves/resolve-attack.ts` — it historically had a local `getEffectivePower` copy. If it still does, remove it and import from `static-effects/index.ts` so attack resolution picks up the new modifier.
3. Static abilities do **not** emit events; skip the "Action log" scenario for pure static modifiers.

### Per-target `attacking` condition in static abilities

The generic `evaluateCondition("attacking")` checks `ids[0]` (first resolved card), which is wrong for per-unit buffs like "Your Arasaka units have +1 power when attacking."

In `computeStaticPowerModifier`, special-case `attacking`: check `attack.attackerId === cardId` (the card whose power you're computing) instead of using the generic evaluator.

**Do NOT change `evaluateCondition` itself** — triggered abilities rely on the existing `ids[0]` semantics.

---

## Step 4 — Write the tests

Replace the scaffold body. Structure the file as **one `describe` block per keyword/ability**, with the ability's full rules text as the `describe` label. Inside each block, cover:

| Scenario            | What to assert                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------------- |
| Happy path          | The effect fired, state changed correctly                                                                     |
| Side effects        | Cards spent, counts changed, zones updated                                                                    |
| Negative path       | `expectFailure` with the right `errorCode`                                                                    |
| Action log          | `getLastActionLog()` has the right `messageKey` and `params`; `formatActionLog` produces readable output      |
| Power during attack | For static power modifiers: use `toHaveEffectivePower` to assert effective power when attacking and when idle |

Add at least **8 meaningful tests** beyond the scaffold. Note the baseline test count before starting.

### Fixture rules — by card type

#### Legend

- **Default (triggered / flip abilities)**: `legendArea: [legend]` — card starts face-down; static abilities are **INACTIVE**; enters play via `callLegend`.
- **To test a static ability without calling the legend first**, use:
  ```ts
  legendArea: [{ card: legend, faceDown: false }];
  ```
  Omitting `faceDown: false` silently disables the ability — you will see base power.
- **GO SOLO legends entering ready**: `field: [{ card: legend, spent: false, faceDown: false }]` — no `legendArea` entry needed. The `faceDown: false` is critical: legends default to `faceDown: true` at creation time (based on initial zone), and the fixture only overrides `faceDown` when explicitly set. Without it, triggered abilities on a field legend will be silently inactive because `collectFromAllCards` skips face-down legends.
- Filler legends (auto-filled when `legendArea` < 3) start face-down and cannot silently activate static abilities — no need to exclude them explicitly.
- **`spent: true` is overridden by `skipSetup`** for legend area cards: the fixture engine resets all legend area cards to `spent: false` on setup. To test "legend is already spent" scenarios, use `engine.patchState(draft => { ... draft.G.cardIndex[id].meta.spent = true; })` after creating the fixture.
- **`callLegend` always costs 2 eddies**: add `eddies: 2` (or more) to any fixture that calls a legend.
- **`attackRival` / `attackUnit` now fire `cardAttacks` triggers**: legends and field units with `trigger.trigger === "event" && event.event === "cardAttacks"` will fire when any unit attacks (after the engine fixes in PR feat/implement-river-ward-detective-on-the-hunt).

#### Unit

- **Play from hand** (summoning sickness applies): `hand: [unit], eddies: cost` → call `engine.playCard(unit)`.
- **Pre-placed on field, ready** (no summoning sickness): `field: [{ card: unit, spent: false }]`.
- **Pre-placed on field, spent**: `field: [{ card: unit, spent: true }]`.
- **GO SOLO units**: play via `playCard(unit)`; they enter ready and can attack that turn.

#### Program

- Programs are one-shot. Place in hand, pay cost, play — the effect resolves immediately and the card goes to trash.
- `hand: [program], eddies: cost` → `engine.playCard(program)` → assert state change, then check card is in trash.
- Programs have no power; skip all power/attack assertions.

#### Gear

- Gear must be attached to a valid host. `hand: [gear], eddies: cost` + a target unit on the field → `engine.attachGear(gear, targetUnit)`.
- When the host unit leaves the field, Gear moves to the same zone (assert this).
- Gear with a static power modifier buffs the **host's** effective power; test with `toHaveEffectivePower` on the host.

### Cross-type fixture rules (apply to all)

- A card definition appears in **at most one player's fixture**; the engine deduplicates filler picks, but explicit placements must not overlap.
- `gigArea` entries: `[{ dieType: "d6", faceValue: 3 }]`. **Standard fixer dice are one each:** `d4, d6, d8, d10, d12, d20`. To create a sided-pair (two dice with the same face value), use two **different** die types with the same `faceValue` — e.g. `[{ dieType: "d6", faceValue: 3 }, { dieType: "d8", faceValue: 3 }]`. Using the same `dieType` twice will silently fail because only one die of each type exists in the fixer area.
- **Filler legends are drawn from the full card catalog.** Never assume a specific card is absent from the legend area unless you control all three slots.
- **Eddies do not regenerate between turns.** Set `eddies` high enough for all plays from the start (e.g. `eddies: cost * 4`).
- **`deck: N` fixture draws N cards into the deck list, but `createMatchState` draws 6 cards to the opening hand.** If you use `deck: N` to test a "trash from deck" or "count deck cards" effect, use at least `deck: 20` (or larger) so that 14+ cards remain after the opening-hand draw. Using `deck: 5` or fewer will leave the deck empty and the effect will silently no-op.
- **To put a card in hand for a second turn**, declare two copies at fixture time: `hand: [card, card]`; the second remains after the first is played.
- **`completeTurn()` cannot be called while an attack is in progress.** Resolve the attack first (via `resolveAttack` steps), then call `passPhase()` once (already in attack phase) instead of `completeTurn()` (which calls `passPhase` twice and fails because the second call is the opponent's turn).
- **Attacking a ready rival unit** returns error code `TARGET_READY`, not `DEFENDER_NOT_SPENT`. Use `expect(failure.errorCode).toBe("TARGET_READY")` in negative-path tests.

### TestEngine conventions

| Convention                                | Detail                                                                                                                                                                                                                                                               |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `engine.passToAttackPhase()`              | Wraps `passPhase()`; advances from play to attack phase                                                                                                                                                                                                              |
| `engine.getAttackState()`                 | Safe accessor; **never** read `engine.getState().G.attackState` directly                                                                                                                                                                                             |
| `engine.getCard(card)`                    | No zone/player args when the card is unique on the board. **If the card catalog includes the same definition for deck filler, always pass zone and player** — e.g. `engine.getCard(card, "field", P1)` — to avoid resolving to a different instance in the deck/hand |
| `engine.getLastActionLog()`               | **Never** write a local `lastLog` helper (N/A for static-only abilities)                                                                                                                                                                                             |
| `engine.getGigValue(playerId, dieIndex?)` | Returns `faceValue` of the nth gig die (0-indexed)                                                                                                                                                                                                                   |
| `engine.getHandCount(playerId)`           | Returns number of cards in hand                                                                                                                                                                                                                                      |
| `{ as: P1 }`                              | Omit — active player defaults to P1; only pass `{ as: P2 }` when acting as P2                                                                                                                                                                                        |
| Reusable assertions                       | Belong on `CyberpunkTestEngine` as a method, not as a test-local function                                                                                                                                                                                            |
| `registerMatchers()`                      | Must be called once at the top of any test file that uses `toHaveEffectivePower` or other custom matchers. Import from `"../../testing/index.ts"`                                                                                                                    |
| `toHaveEffectivePower`                    | `expect(engine.getState()).toHaveEffectivePower({ card: instance.instanceId as string, value: n })` — verify power with/without static modifier, before and during attack                                                                                            |
| `engine.resolveCardToPlay(gear)`          | Resolves a `chooseCardToPlay` pending choice by selecting the given gear card. Required after any ability that uses the `playCard` effect (e.g. River Ward's equip).                                                                                                 |
| `engine.activateAbility(card, idx)`       | Activates a spend-activated ability on a card. `idx` is the 0-based ability index in the card's `abilities` array. Pays costs and executes effects.                                                                                                                  |
| `engine.resolveSearchDeck(cards)`         | Resolves a `searchDeck` pending choice. Pass an array of card refs to select (or `[]` to pick nothing). Selected cards go to hand; rest are bottom-decked.                                                                                                           |
| `engine.resolveDiscardFromHand(cards)`    | Resolves a `discardFromHand` pending choice. Pass an array of card refs to discard from hand to trash. The number of cards must match the required discard amount.                                                                                                   |

For static power modifiers, add a test proving idle units on the same field are **NOT** buffed (only the qualifying unit benefits).

**When asserting "no effects" on a unit**, filter by `origin: "imperative"` or specific `kind`/`rule` values. Units on the field carry static `cantAttack` (summoning sickness) active effects with `origin: "static"` — a raw `activeEffects.some(e => e.targetCardId === id)` check will always be true and the negative assertion will fail.

---

## Step 5 — Run and iterate

```sh
source ~/.zshrc && vp test packages/engine --run
```

Fix failures. Do not move on until **all tests pass**. Confirm the new test count exceeds the pre-implementation baseline by at least 8.

---

## Step 6 — Retrospective (self-update this skill)

Answer each question below. For any answer that reveals a new pattern, edge case, or constraint, **edit this SKILL.md file directly** to incorporate it. That is what creates the virtuous loop — each card either confirms existing patterns (prompt stays tight) or reveals a new constraint (prompt absorbs it so the next card starts with that knowledge already baked in).

Questions to answer:

1. Was any engine operation missing? → document the pattern for detecting this earlier (add to Step 3)
2. Did any fixture constraint cause a failing test that was surprising? → add a note to the matching card-type fixture section in Step 4
3. Was a new `TestEngine` helper needed? → add it to the conventions table
4. Did any rules question arise that the skill didn't answer? → note it so the `cyberpunk-tcg-rules` skill can be updated
5. Were any `ActionLogMessageKey` entries missing? → note the pattern for adding them
6. Was there a per-target condition (`attacking`, `playedThisTurn`, etc.) that needed special handling in `computeStaticPowerModifier` rather than the generic `evaluateCondition`? → document the pattern
7. Did a new card type reveal fixture patterns not yet covered in Step 4? → add a new card-type section

**After editing, commit the updated SKILL.md** with message: `docs(skills): update implement-card playbook after {Card Display Name}`.

---

## Step 7 — Make a PR

- **Branch**: `feat/implement-{CARD_FILE}`
- **Commit message**: `feat(engine): implement {Card Display Name}`
- **PR description** must include:
  - Card type and which abilities are covered
  - Which engine operations were added or reused
