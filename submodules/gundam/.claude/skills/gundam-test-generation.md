---
name: gundam-test-generation
description: Author Gundam TCG card-behavior tests with the canonical `GundamTestEngine` pattern. Invoke this skill whenever you create or modify a `.test.ts` file under `packages/cards/src/cards/**`, including when scaffolded by `implement-card`. Enforces a single house style so every card test is consistent, behavior-driven, and reviewable.
user-invocable: true
argument-hint: "CARD_PATH=<path-to-card-test-file>"
---

# Gundam Test Generation — House Style

This skill is the **single source of truth for HOW a Gundam card test is written**. It is narrow on purpose. Card-implementation orchestration (loading rules, scaffolding files, expanding the engine) is owned by `implement-card`. This file answers only:

> "Given a card definition, what does its `.test.ts` file look like?"

If anything in this skill conflicts with another file, **this skill wins for test syntax**.

The reference implementations (in priority order):

1. [`packages/cards/src/cards/gd01/command/100-a-show-of-resolve.test.ts`](../../packages/cards/src/cards/gd01/command/100-a-show-of-resolve.test.ts) — vanilla Main-only command, gold-standard structure.
2. [`packages/cards/src/cards/gd01/command/099-intercept-orders.test.ts`](../../packages/cards/src/cards/gd01/command/099-intercept-orders.test.ts) — Main+Action+Burst command with multi-target.
3. [`packages/cards/src/cards/gd01/command/101-deep-devotion.test.ts`](../../packages/cards/src/cards/gd01/command/101-deep-devotion.test.ts) — command with target qualification.

The **anti-reference** (do not copy):

- [`packages/cards/src/cards/st09/command/009-giant-killing.test.ts`](../../packages/cards/src/cards/st09/command/009-giant-killing.test.ts) — leads with a data-shape test that pokes `card.effects?.[0]` internals. That kind of structural assertion is reserved for cases where the engine cannot exercise the behavior end-to-end (see "When data-shape tests are allowed" below).

---

## Required preparation

1. Read the card definition file (`{CARD_PATH%.test.ts}.ts`) and the printed effect text it carries.
2. Skim the matching reference test from the list above for the card's `CARD_TYPE` (`unit | pilot | command | base | resource`).
3. Verify the engine already supports each `EffectAction` / `EffectTiming` the card uses. **If the engine does not yet support the behavior, expand the engine first** — never paper over a missing feature with a data-shape assertion.

---

## File layout (every test file)

```ts
import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,           // omit if test is single-sided
  activeResources,      // or restedResources
  createMockUnit,       // any mock helpers the test needs
  expectSuccess,
  expectFailure,
  expectCardInTrash,    // any expect* helpers the test needs
} from "@tcg/gundam-engine";
import { <cardConst> } from "./<NUMBER>-<slug>.ts";

describe("<Card Display Name> (<CARD_NUMBER>)", () => {
  describe("<Printed ability text exactly as on the card>", () => {
    it("<present-tense observable behavior>", () => {
      // ...
    });
  });
});
```

Rules for the layout:

- **One outer `describe`** per card, labelled `Display Name (CARD_NUMBER)`.
- **One inner `describe` per printed ability**, labelled with the **printed text verbatim** (including 【Main】/【Action】/【Burst】/【Deploy】 markers). For multi-clause abilities, use the full clause as written.
- **One `it()` per observable behavior**. Each `it()` reads as a sentence: `"draws 2 cards from deck to hand"`, `"cannot be played without enough active resources"`, `"moves the command card to trash after resolution"`.
- **Imports**: `describe` / `it` / `expect` come from `"vite-plus/test"`; every engine helper (`GundamTestEngine`, `PLAYER_*`, `activeResources`, `createMock*`, `expect*`, `seedShieldsFromDeck`, …) comes from `"@tcg/gundam-engine"`. Never import from `vitest` directly. Never import test-helpers from a deep path inside the engine package.
- **Card under test is imported from the sibling `.ts` file** with a relative `./` path.
- The optional file-top JSDoc block (see gd01-100) is welcome but not required. Keep it short — printed effect, level/cost/color, and any sharp edge a reader would otherwise miss. No essays.

---

## Mandatory coverage (every non-vanilla card)

For each printed ability clause, the test file MUST cover all of these that apply:

| #   | Scenario                    | What to assert                                                                                                                                                                                                                                                                                                                                |
| --- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Happy path                  | The effect resolves and observable state changes (zone moves, damage, exhausted, lore, etc.)                                                                                                                                                                                                                                                  |
| 2   | Source-card zone transition | After resolution, the source card lands in the zone the rules dictate: Commands → trash; deployed Units → `battleArea`; paired Pilots → `battleArea` and `pilotAssignments[unitId]` is set; destroyed Units → trash (and their paired Pilot follows). Do **not** assert "trash" for paired Pilots — `assignPilot` moves them to `battleArea`. |
| 3   | Each timing                 | If the card lists multiple timings (`main`, `action`, `burst`), one `it()` per timing                                                                                                                                                                                                                                                         |
| 4   | Cost gate                   | The card cannot be played / the ability cannot be activated without enough active resources                                                                                                                                                                                                                                                   |
| 5   | Wrong-timing gate           | The card cannot be played outside its timing window (e.g. an Action card during the Draw Phase)                                                                                                                                                                                                                                               |
| 6   | Target gate (per filter)    | Every `attributeFilters` clause gets one positive and one negative `it()`                                                                                                                                                                                                                                                                     |
| 7   | Owner gate                  | If the target is `enemy`/`friendly`, an `it()` proving the opposite owner is rejected                                                                                                                                                                                                                                                         |
| 8   | No-legal-targets path       | The card fails (or no-ops cleanly) when no candidate exists, with the right `errorCode`                                                                                                                                                                                                                                                       |

If a clause cannot meaningfully exercise one of the rows above (e.g. a card with no targets has no row 6), say so in a one-line comment in the file — do NOT silently omit.

`implement-card` requires **at least 8 meaningful tests** beyond the scaffold. This skill agrees: meet that count by covering the rows above for every clause, not by padding with data-shape snapshots.

---

## Engine helpers — use the named ones, do not reinvent

All of these are exported from `@tcg/gundam-engine`. **Use them.** Do not write a local helper for any behavior covered below.

### Setup

```ts
GundamTestEngine.create(
  { hand: [card], resourceArea: activeResources(4), deck: 5 }, // p1 fixture
  { play: [enemyUnit] }, // p2 fixture (omit if not needed)
);
engine.setPhase("end-phase"); // jump to a non-default phase
engine.setStep("action-step"); // jump to a non-default step
```

Resources:

- `activeResources(n)` — n active (untapped) resources.
- `restedResources(n)` — n exhausted resources.
- For a mix, pass `TestCardEntry[]` directly: `[{ card: makeResource(), exhausted: true }, ...]`.

Mock cards (when printed identity does not matter):

- `createMockUnit({ ap, hp, keywordEffects?, ... })`
- `createMockPilot({ level, traits?, color? })`
- `createMockCommand(...)`, `createMockBase(...)`, `createMockResource(...)`

### Player actions (via `engine.asPlayer(PLAYER_ONE)`)

```ts
p1.deployUnit(card, { targets? })
p1.deployBase(card, { targets? })
p1.playCommand(card, { targets? })
p1.playCommandAsPilot(card, unit)
p1.assignPilot(pilot, unit)
p1.activateAbility(card, effectIndex, { targets? })
p1.activateBaseAbility(base, { effectIndex?, targets? })
p1.useSupport(unit, target)
p1.enterBattle(attacker, target | "direct")
p1.declareBlock(blocker)
p1.resolveEffect({ targets?, optionalAnswers?, chooseOneAnswers? })
p1.passPhase() / p1.passActionStep() / p1.passBlock() / p1.passBattleAction()
```

### Queries

```ts
p1.getHand(); // string[] of instance ids
p1.getCardsInZone("battleArea"); // string[] in the named zone
p1.getCardZone(card); // "battleArea:player_one" etc.
p1.getResourceCount();
p1.getDamage(card);
p1.isExhausted(card);
p1.getPilotId(unit);
engine.getG(); // raw G (use sparingly; prefer named getters)
engine.getState(); // full state (sparingly)
```

### Assertions — prefer named expecters over hand-rolled `expect(...).toBe(...)`

```ts
expectSuccess(result)
expectFailure(result, "INSUFFICIENT_RESOURCES")     // always pass the errorCode
expectCardInTrash(engine, cardId, playerId)
expectCardInHand(engine, cardId, playerId)
getDamageCounter(engine, cardId)                    // → number
isCardExhausted(engine, cardId)                     // → boolean
findStatModifier(...) / countStatModifiers(...)
hasKeywordGrant(...) / hasContinuousRestriction(...)
hasPreventDamage(...) / hasPreventDamageToZone(...)
hasForceAttackTarget(...) / hasGrantAttackTargetOption(...)
expectAttackRedirectedTo(engine, blockerId)
markAsLinkUnit(engine, unitId)
seedShieldsFromDeck(engine, playerId, n) / giveShield(...) / seedBaseAsShield(...)
```

If a test needs an assertion not on this list, ask whether it belongs on `GundamTestEngine` as a method instead of inlined into the test file (per `implement-card` Step 4 conventions).

### Error codes (use these exact strings with `expectFailure`)

The most common ones — match the runtime, do not invent new strings:

- `INSUFFICIENT_RESOURCES`
- `WRONG_TIMING`
- `INVALID_TARGET`
- `NO_LEGAL_TARGETS`
- `NO_SUPPORT_KEYWORD`
- `NO_ACTIVATED_ABILITY`
- `EFFECT_PENDING`

---

## Pattern templates

### Command — Main timing only (gd01-100)

```ts
describe("【Main】Draw 2.", () => {
  it("draws 2 cards from deck to hand", () => {
    const engine = GundamTestEngine.create({
      hand: [cardUnderTest],
      resourceArea: activeResources(Math.max(cardUnderTest.level, cardUnderTest.cost)),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const handBefore = p1.getHand().length;

    expectSuccess(p1.playCommand(cardUnderTest));

    expect(p1.getHand().length).toBe(handBefore + 1); // -1 played, +2 drawn = +1
    expect(p1.getCardsInZone("deck").length).toBe(3);
  });

  it("moves the command card to trash after resolution", () => {
    const engine = GundamTestEngine.create({
      hand: [cardUnderTest],
      resourceArea: activeResources(Math.max(cardUnderTest.level, cardUnderTest.cost)),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const cmdId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(cardUnderTest));
    expectCardInTrash(engine, cmdId, p1.playerId);
  });

  it("cannot be played during action-phase (timing is main only)", () => {
    const engine = GundamTestEngine.create({
      hand: [cardUnderTest],
      resourceArea: activeResources(Math.max(cardUnderTest.level, cardUnderTest.cost)),
      deck: 5,
    });
    engine.setPhase("end-phase");
    engine.setStep("action-step");

    expectFailure(engine.asPlayer(PLAYER_ONE).playCommand(cardUnderTest), "WRONG_TIMING");
  });

  it("cannot be played without enough active resources", () => {
    // Size the area for `level` (so the level gate passes) then exhaust
    // enough cards to drop *active* resources below `cost`.
    const res = activeResources(Math.max(cardUnderTest.level, cardUnderTest.cost));
    for (let i = 0; i < res.length - cardUnderTest.cost + 1; i++) res[i]!.exhausted = true;
    const engine = GundamTestEngine.create({ hand: [cardUnderTest], resourceArea: res, deck: 5 });

    expectFailure(engine.asPlayer(PLAYER_ONE).playCommand(cardUnderTest), "INSUFFICIENT_RESOURCES");
  });
});
```

### Command — Main + Action + Burst (gd01-099)

```ts
describe("【Main】/【Action】 Choose 1 to 2 enemy Units with 3 or less HP. Rest them.", () => {
  it("rests one chosen enemy unit during main-phase", () => {
    /* ... */
  });
  it("rests two chosen enemy units during main-phase", () => {
    /* ... */
  });
  it("rests the chosen enemy unit during action-phase", () => {
    /* engine.setPhase("end-phase"); engine.setStep("action-step"); ... */
  });
  it("rests two chosen enemy units during action-phase", () => {
    /* ... */
  });
  it("moves the command card to trash after resolution", () => {
    /* ... */
  });
});

describe("【Burst】 Choose 1 enemy Unit with 5 or less HP. Rest it.", () => {
  it("rests a valid enemy unit when the shield with this card is destroyed", () => {
    const engine = GundamTestEngine.create({ play: [target] }, { deck: [cardUnderTest] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    const targetId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

    // Pre-committed-target path — terser when the choice is unambiguous.
    engine.fireShieldBurst(shieldId!, { targets: [targetId] });
    expect(engine.asPlayer(PLAYER_ONE).isExhausted(target)).toBe(true);
  });

  it("prompts the defender when the burst chooses among multiple legal targets", () => {
    const engine = GundamTestEngine.create({ play: [target] }, { deck: [cardUnderTest] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    const targetId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

    // Two-step path — assert the prompt exists, then resolve it.
    engine.fireShieldBurst(shieldId!);
    if (engine.getPendingChoice()) {
      expectSuccess(engine.asPlayer(PLAYER_TWO).resolveEffect({ targets: [targetId] }));
    }
    // assert observable side effect
  });
});
```

### Command — target qualification (gd01-101)

```ts
describe("【Main】/【Action】Choose 1 friendly Link Unit. It recovers 3 HP.", () => {
  it("recovers 3 HP from a friendly link unit", () => {
    const unit = createMockUnit({ ap: 2, hp: 5 });
    const engine = GundamTestEngine.create({
      hand: [cardUnderTest],
      play: [unit],
      resourceArea: activeResources(Math.max(cardUnderTest.level, cardUnderTest.cost)),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [unitId] = p1.getCardsInZone("battleArea");
    engine.getG().damage[unitId!] = 4;
    markAsLinkUnit(engine, unitId!);

    expectSuccess(p1.playCommand(cardUnderTest, { targets: [unitId!] }));

    expect(getDamageCounter(engine, unitId!)).toBe(1); // max(0, 4-3)
  });

  it("cannot target a friendly unit that is not linked", () => {
    /* same setup minus markAsLinkUnit */
    expectFailure(p1.playCommand(cardUnderTest, { targets: [unitId!] }), "INVALID_TARGET");
  });
});
```

### Unit / Pilot / Base

Use `deployUnit` / `assignPilot` / `deployBase` instead of `playCommand`. Otherwise the same shape: one `describe` per printed ability, mandatory coverage rows applied to that ability's mechanics, `expectSuccess` / `expectFailure` everywhere, named helpers for assertions.

For units with **`duringPair` / `whenPaired` / `whenLinked` / `destroyed` triggers** the canonical reference is [`gd02/unit/003-gundam-mk-ii-titans.test.ts`](../../packages/cards/src/cards/gd02/unit/003-gundam-mk-ii-titans.test.ts) — it is allowed to use `enqueueOwnCardTriggers` inside `runTestMutation` because those events have no end-to-end player-driven repro. That is a **supported escape hatch**, not the default.

### Resource

Resources have no abilities. Assert stats and shape with `assertResourceShape` / `assertResourceInert` / `assertResourceReminderText` from `@tcg/gundam-engine`. No behavior tests needed.

---

## When data-shape tests ARE allowed

A "data-shape test" inspects the card's `effects?.[0]` / `directives` / `activation` fields directly instead of exercising behavior. Acceptable ONLY when:

1. The behavior **cannot** be exercised end-to-end through `engine.asPlayer(...)` because the engine deliberately gates on internals the player API does not expose (e.g. `gd02-118-heart-set-on-revenge` — the `isBattling.opponentMatches` filter requires a manually-seeded `pendingCombat`, and the legality check is done via `evaluateTargetFilter`, not a player move).
2. The card sits behind an unresolved engine gap and the test's purpose is to **document the contract** until the gap closes (e.g. `gd02-003-gundam-mk-ii-titans` data-shape test pins the `qualification` shape that `resolveQualificationActorId` keys off).

In **both** cases the file MUST also contain a behavior test (or a clearly-labelled blocker `it.skip(...)` with a TODO referencing the engine work needed).

A data-shape test on a card whose behavior the engine fully supports — like the `data targets one active enemy Unit with AP <= 4` test in `st09/009-giant-killing.test.ts` — is **not allowed**. Delete it and replace it with a behavior test that plays the command against a 4-AP target and asserts the kill.

---

## Naming rules (`it()` strings)

- **Present tense, observable**: `"draws 2 cards"`, `"destroys an active enemy unit with 4 AP"`, `"moves the command card to trash after resolution"`.
- **Negative tests**: `"cannot be played during action-phase"`, `"cannot target an enemy unit with more than 4 AP"`, `"cannot target a friendly active unit"`.
- **No-target path**: `"fails cleanly when there are no legal targets"`.
- **Cross-turn duration**: `"buff expires at end of turn"`, `"restriction persists through opponent's turn"`.
- **Regression**: `"regression: <one-line description of the prior bug>"`.
- **Forbidden**: `"data targets ..."`, `"effect type is command"`, `"has correct stats and abilities"` (unless the card is genuinely vanilla — and even then prefer asserting the `vanilla` flag, not each stat).

---

## Pitfalls

- **Pre-conditions go in the fixture, not the test body.** Want a damaged unit? Pass `{ card: unit, damage: 3 }` if the API supports it; otherwise mutate `engine.getG().damage[unitId] = 3` once, before the action under test, and document why.
- **Assert the observable side effect, not the runtime path.** `expect(p1.getDamage(target)).toBe(...)` beats reading from `G.damage` directly. `expectCardInTrash(...)` beats inspecting `cardIndex[...]?.zoneKey`.
- **Always pass the `errorCode` to `expectFailure`.** Bare `expectFailure(result)` is a smell — it leaves the failure mode unverified and turns into a flaky regression test.
- **Resource setup matches `level` AND `cost`.** `activeResources(card.cost)` is wrong when the card requires `level ≤ resourceArea.length` — use `activeResources(Math.max(card.level, card.cost))` if they differ.
- **Burst targets — two supported paths**:
  - **Pre-committed**: pass `engine.fireShieldBurst(shieldId, { targets: [...] })` when the test already knows the choice. The engine resolves the prompt synchronously with that target list. Use this for terse, deterministic tests (see `gd01/command/121-midair-modifications.test.ts`).
  - **Two-step prompt**: call `engine.fireShieldBurst(shieldId)`, then if `engine.getPendingChoice()` is non-null, resolve via `engine.asPlayer(<defender>).resolveEffect({ targets })`. Use this when the test wants to assert the prompt exists, the choosing player, or the available candidates.
    Never mutate `G.pendingEffects` by hand to "thread" a target.
- **Pilot/link tests**: `pilotAssignments` is keyed by **unit instance id**, value is the pilot **instance id** (not `cardNumber`). Use `engine.assignPilot(...)` rather than mutating the map manually.
- **Phase changes mid-test**: prefer `engine.setPhase` / `engine.setStep` over running through `passPhase()` loops; keeps test bodies short.
- **Hidden draws**: a fixture without `deck` injects placeholder cards. If your test asserts hand counts, pass an explicit `deck:` so the count is deterministic.

---

## Verification

Run the targeted file first:

```sh
vp test packages/cards/src/cards/<set>/<type>/<file>.test.ts --run
```

Then the whole package:

```sh
vp test packages/cards --run
```

If you expanded the engine to support the card, also run:

```sh
vp test packages/engine --run
vp check
```

---

## Self-update

If during a card test you discover (a) a new error code worth listing, (b) a new helper that should be exported from `@tcg/gundam-engine` and listed here, or (c) a recurring pattern not yet captured — **edit this skill in place** and commit alongside the test:

```
docs(skills): update gundam-test-generation after <Card Display Name> (<CARD_NUMBER>)
```

Keep the diff small. The skill must stay scannable.

---

## Sample handoff prompt

Use this when delegating a test-only task to another agent (Claude Code subagent or Codex):

```md
Use the `gundam-test-generation` skill.

Write or update the test for `<CARD_NUMBER>` at
`packages/cards/src/cards/<set>/<type>/<NUMBER>-<slug>.test.ts`.

Requirements:

- Follow the canonical pattern from the skill exactly. Reference test:
  `packages/cards/src/cards/gd01/command/100-a-show-of-resolve.test.ts`.
- One outer describe per card; one inner describe per printed ability
  (label = printed text verbatim with the 【Marker】).
- Cover every applicable row from the "Mandatory coverage" table.
- Use only named helpers from `@tcg/gundam-engine`. No data-shape tests
  unless the card meets the "When data-shape tests ARE allowed" criteria.
- Always pass `errorCode` to `expectFailure`.
- If the engine does not support the card, expand the engine first; do
  not fall back to inspecting `card.effects[]` to "prove" the data shape.

Run only the targeted test file after editing. Report the new test count.
```
