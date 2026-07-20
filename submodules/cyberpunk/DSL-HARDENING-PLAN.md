# DSL Hardening Plan

Tracking document for follow-up work after the [first audit pass](.claude/plans/we-re-preparing-for-our-quizzical-mochi.md). Each item is scoped with file references, gap analysis, and an implementation outline so any of us can pick it up cold.

> **STATUS LEGEND** — 🔴 alpha-blocker · 🟠 before alpha · 🟡 soon after alpha · 🔵 long-term · ✅ shipped · 🟢 still open

---

## Status as of current main

All 12 numbered items + the original 5-pass audit are merged. Four alpha-class engine bugs were found and fixed in passing.

| Item                                                 | PR                                                                | Status |
| ---------------------------------------------------- | ----------------------------------------------------------------- | ------ |
| Audit cleanup (passes 1–5)                           | [#79](https://github.com/TheCardGoat/cyberpunk-simulator/pull/79) | ✅     |
| 1 — Bound-id ref validation                          | [#80](https://github.com/TheCardGoat/cyberpunk-simulator/pull/80) | ✅     |
| 2 — Context-key enum (B1 fix)                        | [#82](https://github.com/TheCardGoat/cyberpunk-simulator/pull/82) | ✅     |
| 3 — Generated.ts invariants                          | [#85](https://github.com/TheCardGoat/cyberpunk-simulator/pull/85) | ✅     |
| 4 — Per-card test gate + 8 tests                     | [#86](https://github.com/TheCardGoat/cyberpunk-simulator/pull/86) | ✅     |
| 5 — `fightResolved` event (Satori)                   | [#83](https://github.com/TheCardGoat/cyberpunk-simulator/pull/83) | ✅     |
| 6 — Effect/Condition/Cost exhaustiveness             | [#84](https://github.com/TheCardGoat/cyberpunk-simulator/pull/84) | ✅     |
| 7 — Negative event-filter tests + host-source filter | [#87](https://github.com/TheCardGoat/cyberpunk-simulator/pull/87) | ✅     |
| 8 — Authoring linter                                 | [#88](https://github.com/TheCardGoat/cyberpunk-simulator/pull/88) | ✅     |
| 9 — RuleModifier coverage (B2 fix)                   | [#81](https://github.com/TheCardGoat/cyberpunk-simulator/pull/81) | ✅     |
| 10 — DSL versioning                                  | [#89](https://github.com/TheCardGoat/cyberpunk-simulator/pull/89) | ✅     |
| 11 — Effect-corpus shape test                        | [#90](https://github.com/TheCardGoat/cyberpunk-simulator/pull/90) | ✅     |
| 12 — `attachCard` distinct effect                    | [#91](https://github.com/TheCardGoat/cyberpunk-simulator/pull/91) | ✅     |
| Integration fixup                                    | [#93](https://github.com/TheCardGoat/cyberpunk-simulator/pull/93) | ✅     |

### Bug status

- **B1** (gorilla-arms `triggeredGig` typo) — ✅ fixed in #82.
- **B2** (`cantAttack` not enforced) — ✅ fixed in #81.
- **B3** (`canAttackSpentUnits` no handler) — ✅ resolved by removing the no-op rule and mapping Sandevistan to `canAttackOnPlayedTurnAgainstUnits`, matching its intended attack-on-play behavior against spent rival units.
- **Satori `fightOutcome`** — ✅ fixed in #83 via the new `fightResolved` event.
- **`gigStolen host` source filter** — found and fixed during item 7 work in #87.

---

## ✅ R1–R7 closed in [#95](https://github.com/TheCardGoat/cyberpunk-simulator/pull/95)

After 13 PRs, follow-up items R1–R4 remained. They were closed in a single consolidated PR alongside the plan validation. While extending the same patterns across the corpus, R6 and R7 surfaced — additional cards with the same drift that R1 and R4 fixed. All seven items shipped together in [#95](https://github.com/TheCardGoat/cyberpunk-simulator/pull/95).

### R1 ✅ Saburo — duplicated reminder text — _fixed_

Removed the parenthetical `(Units steal an extra gig for every 10 power.)` from [saburo-arasaka-stubborn-patriach.ts](packages/cards/src/alpha/legends/saburo-arasaka-stubborn-patriach.ts) `rulesText`; the reminder lives only in `reminderText` now.

### R2 ✅ Keyword/triggered-ability `source` consistency — _fixed_

C1 from the original audit. Added `source: { selector: "self" }` to:

- 5 keyword abilities (royce-psycho-on-the-edge, v-streetkid, alt-cunningham-soulkiller-architect, goro-takemura-hands-unclean's GO SOLO, v-corporate-exile)
- 5 triggered abilities (jackie-welles-pour-one-out-for-me, viktor-vektor, yorinobu-arasaka-embracing-destruction, evelyn-parker-scheming-siren, ruthless-lowlife)

[authoring-conventions.test.ts](packages/cards/tests/authoring-conventions.test.ts) gained a new assertion: every `kind: "keyword"` and `kind: "triggered"` ability must declare a `source`. Drift now fails CI.

### R3 ✅ `CardKeyword` as a subset of `RuleModifier` (D2) — _fixed_

[packages/types/src/index.ts](packages/types/src/index.ts) now defines `CardKeyword = Extract<RuleModifier, "blocker" | "goSolo">`. Removing or renaming a member of `RuleModifier` automatically narrows `CardKeyword`, and TypeScript flags every card that uses the dropped keyword. Same drift-prevention pattern as the context-key enum from #82.

### R4 ✅ Pass 5 — Street Cred multiplier mismatch (yorinobu, MT0D12) — _fixed (text-only)_

Stripped `* (Street Cred)` notation from yorinobu and MT0D12 card text. Reasoning: literal multiplication makes the conditions nonsensical (e.g. MT0D12 "7+ _ Street Cred" only fires when Street Cred = 0 — `7 _ 0 = 0`). The notation looks like a designer-note that never got an implementation. The engine encoding (fixed thresholds — `value: 20`for yorinobu,`value: 7` for MT0D12) is the source of truth for what the cards actually do, and the text now reads cleanly.

If the rules SME later confirms scaling was intended, a `StreetCredScaledValue` primitive can be added to `NumericValue` and these two cards migrated. Until then, the text and the encoding agree.

### R6 ✅ Street Cred notation drift on three more cards — _fixed (text-only)_

R4 only caught the two cards explicitly called out in Pass 5 (yorinobu, MT0D12). A re-grep of the corpus turned up the same `* (Street Cred)` notation on three more cards. Stripped on all three for consistency with the R4 reasoning — literal multiplication is nonsensical and the engine threshold is the source of truth:

- [armored-minotaur.ts](packages/cards/src/alpha/units/armored-minotaur.ts) — `12+ * (Street Cred)` → `12+ Street Cred`
- [dying-night-v-s-pistol.ts](packages/cards/src/alpha/gear/dying-night-v-s-pistol.ts) — `7+ * (Street Cred)` → `7+ Street Cred`
- [industrial-assembly.ts](packages/cards/src/alpha/programs/industrial-assembly.ts) — `7+ * (Street Cred)` → `7+ Street Cred`

### R7 ✅ Program reminder duplicated in `rulesText` — _fixed (text-only)_

Same drift pattern as R1 (saburo). Four alpha programs had `(Discard programs after they resolve.)` baked into `rulesText` even though the same string already lives in `reminderText`. Removed the parenthetical from `rulesText` so reminder text has a single source of truth — matches the [authoring-conventions.test.ts](packages/cards/tests/authoring-conventions.test.ts) `program-has-discard-reminder` rule.

- [corporate-surveillance.ts](packages/cards/src/alpha/programs/corporate-surveillance.ts)
- [floor-it.ts](packages/cards/src/alpha/programs/floor-it.ts)
- [industrial-assembly.ts](packages/cards/src/alpha/programs/industrial-assembly.ts)
- [reboot-optics.ts](packages/cards/src/alpha/programs/reboot-optics.ts)

`generated.ts` (autogenerated by the scraper) still carries both the `* (Street Cred)` notation and the duplicated parenthetical — that is a separate scraper concern and out of scope here.

### R5 ⏸️ Items deliberately left undone

These were considered and skipped with documented reasoning:

- **Pass 4c — pluralise `CardTargetDSL.state` / `face`.** Every current usage is single-value; pluralising would force every author to write `["spent"]` instead of `"spent"`. The asymmetry (`zones` plural, `state`/`face` singular) matches the actual usage pattern.
- **C3 — target selection metadata consistency.** Resolved by moving choose metadata into the target DSL via `selection`.
- **C4 — canonical Ability field ordering.** Style-only; deferred until the project picks up an oxlint custom rule or a sort codemod becomes worth running.
- **D5 — rename `RawCardRecord.is_eddiable`.** Public API field. Renaming has zero functional value and would break any external consumer of `rawCards`.

---

## Bugs surfaced during investigation

The investigation for items 2 and 9 turned up **three real bugs** in card data / engine that were not in the original audit. All three look alpha-blocking.

### B1 🔴 `gorilla-arms` uses wrong context key (`"triggeredGig"` vs engine's `"triggeredGigs"`)

[packages/cards/src/spoiler/gear/gorilla-arms.ts:66](packages/cards/src/spoiler/gear/gorilla-arms.ts) references `selector: "context", key: "triggeredGig"` (singular).

The engine's [`buildContextTargets` in ability-executor.ts:337-346](packages/engine/src/ability-executor.ts) produces `"triggeredGigs"` (plural — used correctly by [ruthless-lowlife.ts:55](packages/cards/src/alpha/units/ruthless-lowlife.ts)).

**Effect:** the gorilla-arms ability resolves to an empty target set every time it fires. Silent no-op.

**Fix:** rename the card's key to `"triggeredGigs"`. One-line edit. Item 2 (context-key enum) would prevent this class of typo entirely.

### B2 🔴 `RuleModifier: "cantAttack"` has no engine handler

[packages/types/src/index.ts:208-214](packages/types/src/index.ts) declares `"cantAttack"` as a valid `RuleModifier`. [corpo-security.ts:53](packages/cards/src/alpha/units/corpo-security.ts) and [secondhand-bombus.ts](packages/cards/src/alpha/units/secondhand-bombus.ts) both grant this rule on themselves to express "this unit can't attack."

The engine has **no check for `"cantAttack"`** anywhere — neither [moves/attack-unit.ts](packages/engine/src/moves/attack-unit.ts) nor [moves/attack-rival.ts](packages/engine/src/moves/attack-rival.ts) consult it.

**Effect:** Corpo Security and Secondhand Bombus can attack despite their text saying they can't.

**Fix:** in `moves/attack-unit.ts:available()` and `moves/attack-rival.ts:available()`, gate on `getEffectiveRules(attacker).includes("cantAttack")` returning false. Add a test per card.

### B3 ✅ Sandevistan attack-on-play rule

[sandevistan.ts:50](packages/cards/src/alpha/gear/sandevistan.ts) grants `"canAttackOnPlayedTurnAgainstUnits"` to its host on play. The engine checks this rule in `attack-unit.ts` and in player-prompt attack candidates.

**Effect:** Sandevistan's signature ability lets a unit that entered play this turn attack spent rival Units, without allowing direct attacks.

**Fix:** map the card/parser output to `canAttackOnPlayedTurnAgainstUnits` and keep tests for both engine execution and UI prompt candidates.

> **Action:** all three bugs should be filed as separate issues alongside the Satori bug. Item 9 (RuleModifier cross-reference test) below would have caught B2 and B3 at compile time. Item 2 (context-key enum) would have caught B1 at compile time. Both items are now strongly recommended.

---

## Items

### 1 🟠 Bound-id reference validation

**Current state.** 8 cards declare bindings and reference them via `selector: "bound"`:

- [alpha/legends/jackie-welles-pour-one-out-for-me.ts](packages/cards/src/alpha/legends/jackie-welles-pour-one-out-for-me.ts)
- [alpha/programs/reboot-optics.ts](packages/cards/src/alpha/programs/reboot-optics.ts)
- [spoiler/legends/goro-takemura-vengeful-bodyguard.ts](packages/cards/src/spoiler/legends/goro-takemura-vengeful-bodyguard.ts)
- [spoiler/legends/panam-palmer-nomad-cavalry.ts](packages/cards/src/spoiler/legends/panam-palmer-nomad-cavalry.ts)
- [spoiler/legends/river-ward-detective-on-the-hunt.ts](packages/cards/src/spoiler/legends/river-ward-detective-on-the-hunt.ts)
- [spoiler/units/hanako-arasaka-in-a-gilded-cage.ts](packages/cards/src/spoiler/units/hanako-arasaka-in-a-gilded-cage.ts)
- [spoiler/programs/afterparty-at-lizzie-s.ts](packages/cards/src/spoiler/programs/afterparty-at-lizzie-s.ts)
- [spoiler/programs/cyberpsychosis.ts](packages/cards/src/spoiler/programs/cyberpsychosis.ts)

[ability-executor.ts:348](packages/engine/src/ability-executor.ts) (`resolveBindings`) resolves at runtime; no pre-flight validation.

**Gap.** A typo (`id: "selectedUnit"` vs `id: "selectedUnits"`) silently resolves to an empty target set.

**Implementation.** Add [packages/cards/tests/bound-id-references.test.ts](packages/cards/tests/bound-id-references.test.ts):

```typescript
// Walk every card → every ability. For each ability:
// 1. Collect declared binding ids: ability.bindings?.map(b => b.id) ?? []
// 2. Walk effects[] / costs[] / conditions[] / trigger.event recursively
// 3. For every node where selector === "bound", assert id is in declared set
// 4. (Bonus) Assert every declared binding is referenced at least once
```

Walking the ability tree needs a small recursive visitor — every `TargetDSL`-shaped field can hold a bound reference (effect.target, effect.attachTo, condition.target, condition.opponent, etc.).

**Effort.** ~150 lines. ~2 hours.

**Verification.** Run on current data — should pass. Mutate one card's binding id locally and confirm the test fails.

---

### 2 🔴 Context-key enum

**Current state.** [ContextTargetDSL in types/src/index.ts:242-245](packages/types/src/index.ts) — `key: string`. The engine publishes exactly two keys via [`buildContextTargets` in ability-executor.ts:337-346](packages/engine/src/ability-executor.ts):

- `"triggerCard"` — set on `attackDeclared` events, holds the attacker id.
- `"triggeredGigs"` — set on `gigStolen` events, holds the stolen gig die id.

**Card usages (3 sites):**

- [spoiler/legends/panam-palmer-nomad-cavalry.ts:76](packages/cards/src/spoiler/legends/panam-palmer-nomad-cavalry.ts) → `"triggerCard"` ✓
- [alpha/units/ruthless-lowlife.ts:55](packages/cards/src/alpha/units/ruthless-lowlife.ts) → `"triggeredGigs"` ✓
- [spoiler/gear/gorilla-arms.ts:66](packages/cards/src/spoiler/gear/gorilla-arms.ts) → `"triggeredGig"` 🔴 **typo, see B1 above**

**Gap.** `key: string` accepts arbitrary strings. The gorilla-arms typo proves the impact is not theoretical.

**Implementation.**

1. In [types/src/index.ts](packages/types/src/index.ts), define:
   ```typescript
   export type ContextKey = "triggerCard" | "triggeredGigs";
   ```
2. Change `ContextTargetDSL.key: string` → `ContextTargetDSL.key: ContextKey`.
3. Fix gorilla-arms to use `"triggeredGigs"`.
4. (Optional) In `buildContextTargets`, type the dictionary as `Partial<Record<ContextKey, string[]>>` so the producer side is also enum-checked.

**Effort.** ~30 minutes including the bug fix.

**Verification.** `vp check` (compile errors will pinpoint any other typo). Existing gorilla-arms test should now exercise the gig-stealing path correctly — write the assertion that confirms the steal lands.

**Dependencies.** Resolves B1.

---

### 3 🟠 Generated.ts schema validation

**Current state.** [packages/cards/src/generated.ts](packages/cards/src/generated.ts) is autogenerated by `@tcg/cyberpunk-scraper`. Top of file: `// This file is generated by @tcg/cyberpunk-scraper. Do not edit manually.` Final line: `] satisfies CardDefinition[];` — type-checked at compile time.

`structuredCards` (the hand-authored set under `alpha/`/`spoiler/`/`promo/`) and `cards` (the scraper output) are **different sets** — `cards` is a superset that includes all metadata records including ones without ability encodings; `structuredCards` is the abilities-encoded subset.

[packages/cards/tests/index.test.ts](packages/cards/tests/index.test.ts) already validates uniqueness (slug, id) and asserts known displayName / printNumber on a few sample cards. **No runtime schema validation.** No zod / yup / joi in any `package.json`.

**Gap.** If the scraper changes its output shape, `cards` could include records that `satisfies CardDefinition[]` accepts (TS structural typing) but contain semantically wrong data (empty classifications, malformed printings array, broken slugs). The current tests catch only the things they spot-check.

**Implementation.** Two options.

**Option A — Hand-rolled invariant tests** (low effort, recommended). Extend [packages/cards/tests/index.test.ts](packages/cards/tests/index.test.ts) with assertions over every record:

- `id`, `externalId`, `slug` non-empty, no whitespace, slug matches `/^[a-z0-9-]+$/`.
- `set.code` is one of `KnownSetCode`.
- `classifications` array — every element is in `KnownCardClassification`.
- `imageUrl`, `sourceImageUrl` — start with `https://`.
- `cost`, `power`, `ram` — finite non-negative numbers (or null per the type rule).
- For each `printings[]` entry, `finish` ∈ `KnownPrintFinish`.

**Option B — zod schema** (higher effort). Author a zod schema mirroring `CardDefinition` and run `parse` on every record. More robust but adds a dependency and meaningful boot-time cost.

**Effort.** Option A: ~2 hours. Option B: ~1 day plus dependency review.

**Verification.** Run on current data; should pass. Mutate one record (e.g. set `slug: "Bad Slug"`) and confirm failure.

---

### 4 🟠 Per-card test coverage gate

**Current state.** [`tests/automation/exhaustiveness.test.ts`](packages/engine/tests/automation/exhaustiveness.test.ts) covers `defaultChoiceResolvers` (lines 12–27) and `MOVE_IDS` (line 29). **No assertion that every card has a test.**

**Coverage gap (audit results):**

- **Alpha (5 missing tests):** `delamain-cab`, `emergency-atlus`, `mantis-blades`, `swordwise-huscle`, `t-bug-amateur-philosopher`.
- **Spoiler (2 missing tests):** `caliber-totentanz-s-top-dog`, `el-sombreron-la-venganza-lenta`.
- **Promo (1 card, no test folder at all):** `lucyna-kushinada` — no `packages/engine/src/promo/` directory exists.

**Implementation.**

1. Add [packages/engine/tests/coverage.test.ts](packages/engine/tests/coverage.test.ts) that:
   - Imports `structuredCards` from `@tcg/cyberpunk-cards`.
   - For each card, looks for a corresponding `*.test.ts` under `packages/engine/src/{set}/{type}/{slug}.test.ts`.
   - Fails with the missing-card list.

2. Author the 8 missing tests. Even a one-assertion test per card ("the card loads, costs/power match definition, plays into hand→field") is enough to ground the coverage gate. Cards with abilities should additionally exercise the primary trigger path.

**Effort.** Coverage test: ~1 hour. The 8 stub tests: ~30 min each = 4 hours. Total ~5 hours.

**Verification.** Coverage test fails before stubs land; passes after.

**Dependencies.** None. Independent of items 1–3.

---

### 5 🔴 `fightResolved` trigger event (also fixes Satori)

**Current state.** [`AttackResolvedEvent` in game-events.ts:148-156](packages/engine/src/types/game-events.ts):

```typescript
export interface AttackResolvedEvent {
  type: "attackResolved";
  attackerId: CardInstanceId;
  defenderId: CardInstanceId | null;
  attackKind: "fight" | "direct";
  result: "attackerWins" | "defenderWins" | "mutual" | "gigsStolen" | "blocked";
  gigsStolen?: number;
  playerId: PlayerId;
}
```

Emitted from three sites in [`resolve-attack.ts`](packages/engine/src/moves/resolve-attack.ts) (lines 145, 170, 246). The engine event exists but is **never mapped to a DSL event**:

[`EVENT_TYPE_TO_DSL` in triggers/index.ts:23-25](packages/engine/src/triggers/index.ts):

```typescript
export const EVENT_TYPE_TO_DSL: Partial<Record<GameEvent["type"], string>> = {
  attackDeclared: "cardAttacks",
};
```

The `EventTrigger` union in [types/src/index.ts:597-609](packages/types/src/index.ts) has no `FightResolvedEvent`.

**Gap.** [satori-sword-of-saburo.ts:35-68](packages/cards/src/alpha/gear/satori-sword-of-saburo.ts) uses `trigger: "attack"` + `condition: "fightOutcome"`, but the "attack" trigger fires on `attackDeclared` (before the fight) — by the time the queued ability resolves, `fightResult` is still undefined. The `fightOutcome` stub at [target-resolver.ts:241-243](packages/engine/src/effects/target-resolver.ts) returns `false` to avoid worse failure modes.

**Implementation.**

1. **Add `FightResolvedEvent` to [types/src/index.ts](packages/types/src/index.ts):**

   ```typescript
   export interface FightResolvedEvent {
     event: "fightResolved";
     player: EventPlayer; // controller of the attacker, or "any"
     result: "attackerWins" | "defenderWins" | "mutual";
     attacker?: CardTargetDSL; // filter on the attacker
     defender?: CardTargetDSL; // filter on the defender
   }
   ```

   Add to `EventTrigger.event` union.

2. **Add DSL mapping in [triggers/index.ts:23](packages/engine/src/triggers/index.ts):**

   ```typescript
   export const EVENT_TYPE_TO_DSL = {
     attackDeclared: "cardAttacks",
     attackResolved: "fightResolved",
   } satisfies Partial<Record<GameEvent["type"], string>>;
   ```

3. **Filter in [`passesEventFilter` in ability-executor.ts:253-277](packages/engine/src/ability-executor.ts):** add a case for `fightResolved` modeled on `cardAttacks` (which filters by player + attacker classifications). Filter on `result`, `attacker`, `defender` against `event.attackerId` / `event.defenderId`. Restrict to `event.attackKind === "fight"` (skip `direct`/`gigsStolen`/`blocked`).

4. **Migrate Satori** to:

   ```typescript
   trigger: {
     trigger: "event",
     event: {
       event: "fightResolved",
       player: "friendly",
       result: "attackerWins",
       attacker: { selector: "host" },
       defender: { selector: "card", controller: "rival", cardTypes: ["unit"] },
     },
   },
   effects: [{ effect: "draw", player: "friendly", amount: 1 }],
   ```

   The `condition: "fightOutcome"` block goes away entirely.

5. **Remove the dead stub.** Delete `case "fightOutcome"` in [target-resolver.ts:241-243](packages/engine/src/effects/target-resolver.ts) and `FightOutcomeCondition` from [types/src/index.ts](packages/types/src/index.ts).

**Effort.** ~4–6 hours (type, dispatch path, filter, card migration, test).

**Verification.**

- New unit test: Satori host wins a fight against a rival unit → controller draws 1 card. Negative tests: doesn't fire on direct attack, doesn't fire on mutual KO, doesn't fire when host is the defender, doesn't fire on gig-steal-only resolutions.
- Existing satori test ([packages/engine/src/alpha/gear/satori-sword-of-saburo.test.ts](packages/engine/src/alpha/gear/satori-sword-of-saburo.test.ts)) already covers equip mechanics — extend with the trigger assertion.

**Dependencies.** None. Recommended to ship in same PR as the Satori fix.

---

### 6 🟡 Effect / Condition / Cost / Trigger exhaustiveness

**Current state.**

- [`effectHandlers` in handlers/index.ts:627-648](packages/engine/src/effects/handlers/index.ts) — `Record<string, EffectHandler<any>>`. **Lookup throws at runtime** if a handler is missing; no compile-time check that every `Effect.effect` tag has an entry.
- [`evaluateCondition` in target-resolver.ts:196-295](packages/engine/src/effects/target-resolver.ts) — switch with no default. New union members are not flagged.
- [`canPayAbilityCosts` / `payAbilityCosts` in ability-executor.ts:425-461](packages/engine/src/ability-executor.ts) — nested `if` on string keys; new cost types silently skipped (this is exactly how `DefeatCost` got into a broken state before we removed it).
- [`matchTriggers` in triggers/index.ts:27-86](packages/engine/src/triggers/index.ts) — switch on `event.type` for targeted triggers; broadcast pass for event triggers. Reasonable but not exhaustive against `GameEvent`.

The existing [`exhaustiveness.test.ts`](packages/engine/tests/automation/exhaustiveness.test.ts) covers only `defaultChoiceResolvers` and `MOVE_IDS`.

**Implementation (incremental).** Three independent strict-mode upgrades:

1. **Effect handlers:** type the registry as `Record<Effect["effect"], EffectHandler<any>>`. TS will then flag missing handlers at compile time.
   ```typescript
   export const effectHandlers: { [K in Effect["effect"]]: EffectHandler<Extract<Effect, { effect: K }>> } = { ... }
   ```
2. **Conditions:** add a `default: assertNever(condition)` at the bottom of the switch in `evaluateCondition`.
3. **Costs:** rewrite the `if`-chain in `canPayAbilityCosts`/`payAbilityCosts` as a switch with `assertNever`.

Add `function assertNever(x: never): never` once in [packages/engine/src/types/index.ts](packages/engine/src/types/index.ts).

**Effort.** ~1–2 hours. Pure type tightening, no test changes.

**Verification.** `vp check`. Adding a fake new condition/effect/cost without a handler should fail typecheck.

---

### 7 🟡 Negative-coverage tests for event triggers

**Current state.** 11 cards use `trigger: { trigger: "event" }`:

- **Alpha (4):** jackie-welles-pour-one-out-for-me, yorinobu-arasaka-embracing-destruction, evelyn-parker-scheming-siren, ruthless-lowlife
- **Spoiler (7):** gorilla-arms, panam-palmer-nomad-cavalry, river-ward-detective-on-the-hunt, alt-cunningham-soulkiller-architect, goro-takemura-vengeful-bodyguard, cyberpsychosis, meredith-stout-stone-cold-corpo

**Coverage sample (audit findings):**

- ✅ [jackie-welles-pour-one-out-for-me.test.ts:74](packages/engine/src/alpha/legends/jackie-welles-pour-one-out-for-me.test.ts) — has "does not trigger when a non-blue card is played"
- ✅ [ruthless-lowlife.test.ts:56,66](packages/engine/src/alpha/units/ruthless-lowlife.test.ts) — has both "ready" and "friendly steals" negatives
- ❌ [gorilla-arms.test.ts](packages/engine/src/spoiler/gear/gorilla-arms.test.ts) — only attachment mechanics, no event-filter negatives
- The other 8 cards are unsampled; assume incomplete.

**Implementation.** For each of the 11 event-triggered abilities, ensure the test file contains at least one assertion of the form "when `<event matching the type but failing a filter>`, the ability does not fire." Concretely:

- Yorinobu (cardAttacks, classifications: ["Arasaka"]) → assert: non-Arasaka attacker does not fire.
- Evelyn (gigStolen, controller: "friendly") → assert: rival's stolen gigs do not fire.
- Cyberpsychosis (cardAttacks, cardTypes: ["unit"]) → assert: legend attacks do not fire.
- River Ward (cardAttacks, no specific filter) → assert: when no eligible yellow gear-less unit exists, ability is not enqueued ([ability-executor.ts:51-54](packages/engine/src/ability-executor.ts) already short-circuits — assert the test).
- Etc.

**Effort.** ~30 min/card × 11 = ~6 hours total. Independent of other items.

---

### 8 🔵 Authoring linter

**Current state.** Oxlint config at [apps/simulator/oxlint.config.ts](apps/simulator/oxlint.config.ts). Plugins: react, typescript, jsx-a11y, jest. **No card-data lint rules.** No script under `packages/cards/scripts/` (directory does not exist).

**Constraint.** Custom oxlint rules require Rust. The realistic path is a TypeScript validator script run in CI.

**Implementation.** Create [packages/cards/scripts/lint-cards.ts](packages/cards/scripts/lint-cards.ts) that walks `structuredCards` and asserts:

- `kind: "keyword"` abilities have a `keyword` field.
- `kind: "triggered"` abilities have a `trigger` field.
- `kind: "static"` abilities have effects and no trigger.
- Programs include the standard "Discard programs after they resolve" reminder in `reminderText` (or auto-append it via a future `defineCard` helper).
- Gear has `attachment` set.
- `keyword` field on an ability matches one of `keywords` in the card's surface.

Wire into `vp check` via a script entry in [packages/cards/package.json](packages/cards/package.json). Or add as another test under `packages/cards/tests/`.

**Effort.** ~3–4 hours. Pure additive.

**Note.** Several of these checks (programs missing reminder, `keyword` mismatch) are already going to be caught by the planned `defineCard` helper (see "future authoring helper" in the original plan). If `defineCard` lands first, the lint script's job shrinks significantly.

---

### 9 🟠 RuleModifier cross-reference test (catches B2 + B3)

**Current state.** [`RuleModifier` in types/src/index.ts:208-214](packages/types/src/index.ts):

```typescript
export type RuleModifier =
  | "blocker"
  | "goSolo"
  | "cantAttack"
  | "cantBeBlocked"
  | "canAttackOnPlayedTurnAgainstUnits";
```

**Engine handler audit (file:line):**

| Rule                                | Handler                                                                                                                                    | Status    |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| `blocker`                           | [moves/use-blocker.ts:29](packages/engine/src/moves/use-blocker.ts)                                                                        | ✅        |
| `cantBeBlocked`                     | [moves/use-blocker.ts:22,59](packages/engine/src/moves/use-blocker.ts)                                                                     | ✅        |
| `canAttackOnPlayedTurnAgainstUnits` | [moves/attack-unit.ts:32,61](packages/engine/src/moves/attack-unit.ts)                                                                     | ✅        |
| `goSolo`                            | [moves/attack-rival.ts:25](packages/engine/src/moves/attack-rival.ts), [moves/attack-unit.ts:35](packages/engine/src/moves/attack-unit.ts) | ✅        |
| **`cantAttack`**                    | **— none —**                                                                                                                               | 🔴 **B2** |

**Gap.** Two of six declared rules are silently no-ops. The cards using them ship broken.

**Implementation.**

1. **Fix B2 — `cantAttack`:** in [moves/attack-unit.ts:available](packages/engine/src/moves/attack-unit.ts) and [moves/attack-rival.ts:available](packages/engine/src/moves/attack-rival.ts), gate on `getEffectiveRules(attacker).includes("cantAttack")` returning false.
2. **Fix B3 — Sandevistan attack-on-play:** keep Sandevistan mapped to `canAttackOnPlayedTurnAgainstUnits` so its host can attack spent rival units during the turn it entered play.
3. **Cross-reference test** — add [packages/engine/tests/rule-modifier-coverage.test.ts](packages/engine/tests/rule-modifier-coverage.test.ts) that grep-counts each `RuleModifier` literal across `packages/engine/src/moves/`. Asserts every union member appears in at least one file. Use a `RULE_HANDLED_IN: Record<RuleModifier, string[]>` lookup as the source of truth.
4. **Tests for the fixes** — corpo-security and secondhand-bombus must fail to attack; sandevistan-equipped unit must successfully attack a spent rival unit.

**Effort.** ~3 hours for the fixes + tests; ~1 hour for the cross-reference test.

**Dependencies.** Resolves B2, B3.

---

### 10 🔵 DSL versioning

**Current state.** No `version` or `schemaVersion` field anywhere in [types/src/index.ts](packages/types/src/index.ts) or in cards.

**When to do this.** Only when you need to evolve the DSL with a breaking change post-alpha. Adding it preemptively is overhead with no payoff. Park.

---

### 11 🔵 Property-based testing

**Current state.** No fast-check / hypothesis / equivalent in any `package.json`.

**When to do this.** After the DSL stabilises and after item 6 (compile-time exhaustiveness) lands. Generative testing on an unstable DSL just generates noise. Park.

---

### 12 🔵 `attachCard` distinct effect

**Current state.** Exactly **one card** overloads `playCard` with `attachTo` to express "equip": [river-ward-detective-on-the-hunt.ts:93-106](packages/cards/src/spoiler/legends/river-ward-detective-on-the-hunt.ts). [alt-cunningham-soulkiller-architect.ts](packages/cards/src/spoiler/legends/alt-cunningham-soulkiller-architect.ts) uses `playCard` without `attachTo`, so no overload there.

**When to do this.** When a second use case appears or when the overload trips someone up. With one card, the ROI is below the cost of the new effect type + handler + automation strategy + view-prompt updates. Park.

---

## Recommended sequencing

**Hotfix PR (alpha-blocker).** B1, B2, B3 + Satori. Three bugs from this investigation + the original Satori bug. The Satori fix lands as item 5 (`fightResolved`). B1 / B2 / B3 are one-line code fixes plus tests.

**Hardening PR 1 (before alpha, ~1–2 days work).** Items 1, 2, 3, 4, 9. Each has independent value, all five are additive (mostly tests + small type tightening), and items 2 and 9 close the source-of-truth gaps that produced B1 / B2 / B3 in the first place.

**Hardening PR 2 (post-alpha).** Items 6, 7, 8.

**Park.** Items 10, 11, 12.

## Verification of each PR

Standard recipe at every checkpoint:

```
vp run -F @tcg/cyberpunk-types build    # rebuilds dist consumed by other packages
vp run -F @tcg/cyberpunk-cards check
vp run -F @tcg/cyberpunk-cards test
vp run -F @tcg/cyberpunk-cards build    # rebuilds dist consumed by engine
vp run -F @tcg/cyberpunk-engine check
vp run -F @tcg/cyberpunk-engine test
```

The cards package builds to `dist/` and the engine consumes it from there, so any types-package change propagates as: types build → cards check → cards build → engine check.
