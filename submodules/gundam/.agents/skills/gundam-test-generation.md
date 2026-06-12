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

### Current syntax examples

Deploy effects that grant a temporary attack-target option should use
`chooseAttackTarget` and assert the stored grant, not attempt a full attack-rule
simulation:

```ts
expectSuccess(p1.deployUnit(card, { targets: [friendlyUnitId] }));

const grant = getContinuousEffects(engine).find(
  (effect) =>
    effect.targetId === friendlyUnitId && effect.payload.kind === "grant-attack-target-option",
);
expect(grant?.payload).toMatchObject({
  kind: "grant-attack-target-option",
  attackTarget: { owner: "opponent", cardType: "unit", state: "active" },
});
```

For Command effects whose target count changes only when an EX Resource was
used to pay the cost, model the alternate count with `exResourceUnitCount` on
`chooseAttackTarget`. Tests should cover both branches: force EX payment by
exhausting regular resources and leaving an active `EX Resource` token, then
assert both selected units receive the grant; with enough regular active
resources, selecting the larger target set should fail with `INVALID_TARGET`.

Filtered discard text like "discard 1 red card" should use `discard.filter`
instead of an unqualified discard. Cover both the matching-color path and the
non-matching hand path so any following `dependsOnPrevious` directive only
resolves after a real discard:

```ts
{
  action: "discard",
  count: 1,
  filter: {
    owner: "friendly",
    zone: "hand",
    count: 1,
    attributeFilters: [{ attribute: "color", comparison: "eq", value: "red" }],
  },
}
```

For deploy text like "You may discard 1 green (Trait) Unit card. If you do,
place 1 EX Resource. Then, if you are Lv.7 or higher, draw 1", encode the
discard directive as `optional: true`, use a hand-zone `discard.filter`, gate
the EX Resource with `dependsOnPrevious`, and make the draw a separate
conditional directive with `condition: { type: "playerLevel", comparison:
"gte", value: 7 }`. The Lv check is evaluated after prior directives resolve,
so tests should cover the branch where the newly placed EX Resource raises the
player to Lv.7 and the branch where it still leaves them below Lv.7.

```ts
{
  action: {
    action: "discard",
    count: 1,
    filter: {
      owner: "friendly",
      zone: "hand",
      cardType: "unit",
      count: 1,
      attributeFilters: [
        { attribute: "color", comparison: "eq", value: "green" },
        { attribute: "trait", comparison: "includes", value: "earth federation" },
      ],
    },
  },
  optional: true,
},
{ action: { action: "placeExResource", state: "active" }, dependsOnPrevious: true },
{
  condition: { type: "playerLevel", comparison: "gte", value: 7 },
  thenDirectives: [{ action: { action: "draw", count: 1 } }],
}
```

For activated abilities with a typed discard before the colon, encode it as an
activation cost, not as the first directive. Use `cost.discardCount` plus
`cost.discardFilter`, and keep the effect body focused on the post-cost
directive. For text that requires "if a Pilot is not paired with this Unit",
gate activation with `conditions: [{ type: "selfIsUnpaired" }]`.

Destroyed effects that are qualified by the paired Pilot's trait should use
`conditions: [{ type: "duringPair" }, { type: "selfPairedPilotHasTrait", trait:
"vulture" }]` and assert both the matching-pilot path and the non-matching path.
When the card also says "if it is your turn", set `activePlayer`/`turnPlayer`
explicitly in direct `destroyUnit` tests before destroying the Unit.

Triggered text like "You may pay ①. If you do, draw 1. Then, discard 1" should
use an optional `payResources` directive followed by `dependsOnPrevious`
directives for the gated draw/discard. Tests should cover accepted payment,
declined payment, and insufficient active resources.

Look-at-top-1 text that says "return it to the top of your deck or place it
into your trash" should use `lookAtTopDeck` with `return: "topOrTrash"` and
assert the deterministic trash branch plus the empty-deck no-op.

Deploy text that creates a this-turn rider like "when one of your [trait] Units
destroys an enemy Unit with battle damage..." should use `createDelayedTrigger`
with `eventType: "attackerDestroyedDefender"` and an `eventCardFilter` matching
the friendly attacker. Test the qualifying attacker, a non-matching attacker,
and any target filter on the delayed effect.

Attack text like "you may choose 7 [trait] cards from your trash. Exile them.
If you do..." should model the exile as an optional counted `exile` directive
with `zone: "trash"` and exact `count`. A following directive should use
`dependsOnPrevious`; tests should prove declining the exile skips the follow-up.

Pilot-resident constant text like "【During Link】When this Unit receives effect
damage from an enemy, reduce it by 2" should use a constant `reduceNextDamage`
directive with `conditions: [{ type: "duringLink" }]`, `target: { owner: "self"
}`, `damageType: "effect"`, and `source: "enemy"`. Tests should pair the Pilot
to a Unit whose `linkCondition` names the Pilot, deal effect damage from an
enemy source through `executeCardEffect`, and prove friendly-source or
non-linked damage is not reduced.

Pilot-resident destroyed text that says "this Unit" should keep filters tied
to the paired Unit, not the Pilot card. For "enemy Unit whose Lv. is equal to
or lower than this Unit", use a source-stat reference; the executor preserves
the destroyed host as `selfIdentityCardId` while the pending effect resolves:

```ts
{
  action: {
    action: "returnToHand",
    target: {
      owner: "opponent",
      cardType: "unit",
      count: 1,
      attributeFilters: [
        { attribute: "level", comparison: "lte", value: { ref: "source", stat: "level" } },
      ],
    },
  },
}
```

Action commands that say "all enemy Units must choose that Unit as their attack
target" should use `forceAttackTarget` with `unit: { owner: "opponent",
cardType: "unit", count: "all" }` and `attackTarget` as the actual chosen
rested friendly Unit. Tests should prove the command installs
`force-attack-target` entries on current enemy Units, rejects direct or
alternate attacks with `INVALID_TARGET`, and allows attacking the chosen Unit.
For continuous text like "Enemy Units choose this rested Unit...", use a
constant `forceAttackTarget` directive with `attackTarget: { owner: "self",
cardType: "unit", state: "rested" }` and gate it with `duringPair`/`duringLink`
plus `selfIsRested`; tests should exercise attack validation rather than
expecting a stored continuous-effect entry.

Triggered linked-pilot text like "when this rested Unit is set as active by an
effect..." should use timing `["duringLink", "onSetActiveByEffect"]`. Tests can
execute a small synthetic `setActive` effect against the paired Unit; if there
is only one legal follow-up target, the pending effect may auto-resolve, so
assert the observable zone/state change and only call `resolveEffect` when
`engine.getPendingChoice()` is present.

Battle-damage rider text like "when this Unit deals battle damage to an enemy
Unit..., destroy that enemy Unit" should use timing
`["onBattleDamageDealtToUnit"]`, gate the damaged Unit with
`conditions: [{ type: "eventCardMatches", target: ... }]`, and use
`destroyEventCard` for the damaged Unit itself. Add any board-state gate, such
as a required Pilot in play, as a separate `cardInZone` condition.
For command text that grants that rider "during this turn" to a chosen Unit,
use `createDelayedTrigger` with `eventType: "battleDamageDealtToUnit"`,
`eventSourceFilter` for the chosen friendly Unit, and `eventCardFilter` for the
damaged enemy Unit. The delayed effect body can then use `destroyEventCard`.

Battle-context keyword grants should use the relational
`isBattling.opponentMatches` filter and seed combat through `enterBattle` (or
directly set `G.turnMetadata.pendingCombat` for pure derived-state tests). When
testing a damaged enemy, set `engine.getG().damage[enemyId] = 1` explicitly:

```ts
engine.getG().damage[enemyId] = 1;
expectSuccess(p1.enterBattle(attackerId, enemyId));

const framework = engine.getRuntime().getFrameworkReadAPI();
expect(getEffectiveStats(attackerId, engine.getG(), framework.cards, framework).keywords).toContain(
  "Breach",
);
```

Observer triggers for "when one of your Units destroys an enemy Unit with battle
damage" can use `engine.resolveCombat` and a linked observer marked with
`markAsLinkUnit`. The attacker and observer should be separate cards:

```ts
markAsLinkUnit(engine, observerId);

engine.resolveCombat({ attackerId, target: fragileDefenderId });

expect(engine.getG().exhausted[observerId]).toBe(false);
```

Optional deploy-time `pairPilot` effects still need a legal target supplied to
the deploying move, then the optional answer is resolved from the pending effect:

```ts
expectSuccess(p1.deployUnit(unitCard, { targets: [pilotId] }));
while (engine.getPendingChoice()) {
  expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));
}

expect(engine.getG().pilotAssignments[unitId]).toBe(pilotId);
```

Pilot-resident `【During Link】【Attack】` effects should pair the pilot through
the public API, attack with the linked host Unit, then resolve the pending
effect choice:

```ts
expectSuccess(p1.deployUnit(linkHost));
expectSuccess(p1.assignPilot(pilotUnderTest, linkHost));

expectSuccess(p1.enterBattle(linkHost, restedEnemyUnitId));
expectSuccess(p1.resolveEffect({ targets: [targetId], optionalAnswers: { 0: true } }));
```

Unit `【Attack】Choose 1 enemy Unit. Rest it.` tests should enter battle through
the public API and assert the enemy Unit's exhausted state. If there is only
one legal target, the engine may auto-resolve without leaving a pending choice:

```ts
expectSuccess(p1.enterBattle(attackerId, enemyId));
if (engine.getPendingChoice()) {
  expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
}

expect(p2.isExhausted(enemyId)).toBe(true);
```

`【When Paired･(Trait) Pilot】` effects that grant many Units a temporary
attack-target option should pair through `assignPilot`, then inspect
`getContinuousEffects(engine)` for one `grant-attack-target-option` per
eligible recipient:

```ts
expectSuccess(p1.assignPilot(traitPilot, sourceUnitId));

const grant = getContinuousEffects(engine).find(
  (effect) =>
    effect.targetId === eligibleUnitId && effect.payload.kind === "grant-attack-target-option",
);
expect(grant?.payload).toMatchObject({
  kind: "grant-attack-target-option",
  attackTarget: { owner: "opponent", cardType: "unit", state: "active" },
});
```

For "deal N damage; when this effect destroys that Unit, draw M", use the
combined production action so the draw is tied to the Unit actually destroyed
by the damage action:

```ts
{
  action: {
    action: "dealDamageThenDrawIfDestroyed",
    amount: 1,
    target: { owner: "opponent", cardType: "unit", state: "rested", count: 1 },
    drawCount: 1,
  },
}
```

Action Commands that prevent battle damage to a Unit paired with a traited
Pilot should target the Unit with `pairedPilotTrait`, set
`damageType: "battle"` and `duration: "duringBattle"`, and use a conditional
directive for Lv.7+ threshold upgrades:

```ts
{
  action: {
    action: "preventDamage",
    damageType: "battle",
    duration: "duringBattle",
    target: {
      owner: "friendly",
      cardType: "unit",
      count: 1,
      attributeFilters: [{ attribute: "pairedPilotTrait", comparison: "includes", value: "x-rounder" }],
    },
    unitFilter: {
      owner: "opponent",
      cardType: "unit",
      attributeFilters: [{ attribute: "ap", comparison: "lte", value: 2 }],
    },
  },
}
```

For "look at the top N, return 1 to the top, place the remaining card into
trash", encode `lookAtTopDeck` with `remainingDestination: "trash"`:

```ts
{
  action: {
    action: "lookAtTopDeck",
    count: 2,
    return: "chooseTop",
    remainingDestination: "trash",
  },
}
```

For "mill, then if the milled card has trait X, damage a target", use the
combined production action so the condition is tied to the card actually moved
by the effect:

```ts
{
  action: {
    action: "millDeckThenDamageIfTrait",
    count: 1,
    owner: "self",
    traits: ["zeon", "clan"],
    damage: 1,
    target: { owner: "opponent", cardType: "unit", count: 1 },
  },
}
```

For "mill N, then deal damage equal to the number of milled cards with trait
X", use the count-preserving sibling:

```ts
{
  action: {
    action: "millDeckThenDamageByTraitCount",
    count: 2,
    owner: "self",
    traits: "minerva squad",
    target: {
      owner: "opponent",
      cardType: "unit",
      count: 1,
      attributeFilters: [{ attribute: "ap", comparison: "lte", value: 4 }],
    },
  },
}
```

For "during your turn, when this Unit receives effect damage" token triggers,
encode the card as `onEffectDamageReceived` with `eventCardIsSelf` and an
`isTurn` gate. Tests can drive the event through a simple command that deals
effect damage to a friendly Unit:

```ts
{
  type: "triggered",
  activation: {
    timing: ["onEffectDamageReceived"],
    restrictions: [{ type: "oncePerTurn" }],
    conditions: [{ type: "isTurn", whose: "friendly" }, { type: "eventCardIsSelf" }],
  },
  directives: [{ action: { action: "deployToken", token } }],
}
```

For "when this Unit is rested by an effect" triggers, use the
`onRestedByEnemyEffect` timing currently emitted by the generic rest action,
and add `eventCardIsSelf` when only the rested source Unit should react:

```ts
{
  type: "triggered",
  activation: {
    timing: ["onRestedByEnemyEffect"],
    restrictions: [{ type: "oncePerTurn" }],
    conditions: [{ type: "eventCardIsSelf" }],
  },
  directives: [{ action: { action: "setActive", target: { owner: "self", cardType: "unit" } } }],
}
```

If the triggered action targets "one of your" Units and the source also
matches the filter, current auto-resolution may apply the effect to the source;
keep tests aligned with that legal target set unless the card text excludes
it.

Cards that react to their own `<Support>` successfully increasing AP should use
the `onSupportUsed` timing and gate the supported Unit with `eventCardMatches`.
The trigger event's `cardId` is the supported target, while the effect source is
the Support Unit:

```ts
{
  type: "triggered",
  activation: {
    timing: ["onSupportUsed"],
    conditions: [
      { type: "selfPairedPilotHasTrait", trait: "coordinator" },
      {
        type: "eventCardMatches",
        target: {
          owner: "friendly",
          cardType: "unit",
          attributeFilters: [{ attribute: "trait", comparison: "includes", value: "zaft" }],
        },
      },
    ],
    restrictions: [{ type: "oncePerTurn" }],
  },
  directives: [
    { action: { action: "setActive", target: { owner: "self", cardType: "unit" } } },
  ],
}
```

For "when you pay cost for one of your Units' effects, increase this Unit's AP
by the cost paid", use `onUnitEffectCostPaid` with
`statModifierByEventPaidCost`. The triggering event carries the Unit that paid
the cost as `eventCardMatches` and the resource count as the modifier amount:

```ts
{
  type: "triggered",
  activation: {
    timing: ["onUnitEffectCostPaid"],
    conditions: [{ type: "eventPlayerIsSelf" }],
    restrictions: [{ type: "oncePerTurn" }],
  },
  directives: [
    {
      optional: true,
      action: {
        action: "statModifierByEventPaidCost",
        stat: "ap",
        duration: "thisTurn",
        target: { owner: "self", cardType: "unit" },
      },
    },
  ],
}
```

For "friendly Units can't be destroyed by enemy effects", use
`preventDestroy` with `source: "enemy"` and a friendly Unit target. This
protects against direct `destroy` actions from enemy effects; it does not stop
your own effects from destroying your cards:

```ts
{
  action: {
    action: "preventDestroy",
    source: "enemy",
    duration: "thisTurn",
    target: { owner: "friendly", cardType: "unit", count: "all" },
  },
}
```

For top-deck effects that deploy a matching revealed Unit instead of adding it
to hand, use `lookAtTopDeck` with `tutorFilter` and
`tutorDestination: "battleArea"`. The handler deploys the first matching
revealed card for free, marks it deployed this turn, and fires its deploy
triggers:

```ts
{
  action: {
    action: "lookAtTopDeck",
    count: 3,
    return: "chooseTop",
    tutorDestination: "battleArea",
    tutorFilter: {
      owner: "friendly",
      cardType: "unit",
      attributeFilters: [
        { attribute: "trait", comparison: "includes", value: "zaft" },
        { attribute: "level", comparison: "lte", value: 4 },
      ],
    },
  },
}
```

- **EX Resource placement from non-resource effects**: use `action: "placeExResource"` when printed text says "Place 1 EX Resource" and the source card should stay in its current zone. `placeResource` is legacy syntax for effects that intentionally move the source card itself into the resource area.
- **EX Base deployment from effects**: use `action: "deployExBase"` for "Deploy 1 EX Base." It creates an EX Base token in the source controller's `baseSection` and no-ops if that section is already occupied. Tests should assert the token definition name and that the source Command still moves to trash.
- **Damage equal to a board count**: use `action: "dealDamageByCount"` with a `countFilter` for the counted cards and a normal `target` filter for the damaged card. For "number of friendly Unit tokens in play", use `{ owner: "friendly", cardType: "unit", isToken: true }` and mark fixture tokens with `engine.markAsToken(id)`.
- **Damage based on source AP/HP**: use `action: "dealDamageBySourceStat"` with `stat`, `divisor`, `damagePerStep`, and `target` for text like "Deal 1 damage for each 4 AP this Unit has." Tests should assert the source's effective stat setup through normal modifiers/pilots, then resolve the attack trigger.
- **Damage gated by the level of a previously chosen Unit**: for text like "Choose 1 active friendly Unit. Rest it. If you do, choose 1 enemy Unit whose Lv. is equal to or lower than the Unit rested with this ability. Deal 3 damage to it.", use `action: "dealDamageByChosenUnitLevel"` on the dependent directive:
  ```ts
  {
    action: {
      action: "dealDamageByChosenUnitLevel",
      amount: 3,
      referenceTarget: { owner: "friendly", cardType: "unit", state: "rested", count: 1 },
      target: { owner: "opponent", cardType: "unit", count: 1 },
    },
    dependsOnPrevious: true,
  }
  ```
  Tests should pass both chosen IDs to the command (`targets: [friendlyUnitId, enemyUnitId]`), assert the friendly Unit becomes rested, assert equal/lower-level enemies take damage, and assert higher-level enemies take 0 damage while the rest step still resolves.
- **Constant battle-damage prevention**: for "this Unit can't receive enemy battle damage while <condition>", use a constant `preventDamage` directive with `target: { owner: "self" }`, `damageType: "battle"`, and `unitFilter: { owner: "opponent", cardType: "unit" }`, then put the condition in `activation.conditions` such as `cardInZone` with `hasName`. Test by making the protected Unit rested, letting an enemy Unit attack it, passing through block/action, and asserting damage stays at 0; include the no-condition negative where the Unit takes damage or is destroyed.
- **Next-damage reduction and EX-paid Commands**: for "During this turn, reduce the next damage it receives by 2. If you use an EX Resource to play this card, reduce by 4 instead", use `action: "reduceNextDamage"` with `amount`, `exResourceAmount`, `duration: "thisTurn"`, and a normal `target` filter:
  ```ts
  {
    action: {
      action: "reduceNextDamage",
      amount: 2,
      exResourceAmount: 4,
      duration: "thisTurn",
      target: { owner: "friendly", cardType: "unit", count: 1 },
    },
  }
  ```
  The command payment path threads `paidExResources` into the executor, so tests can force EX payment by exhausting regular resources, leaving an active resource marked with `engine.markAsToken(exResourceId)`, then playing the Command. Assert the actual damage counter after battle/effect damage and that the `damage-reduction` continuous effect is consumed after the next damage event.
  For battle-step text like "During this battle, reduce battle damage it receives by 3", use the same action with `amount: 3`, `damageType: "battle"`, and `duration: "thisBattle"`, then play the Command during the Action Step before passing battle actions.
- **Retaliation against a battle-damage source**: use timing `onBattleDamageReceived` plus `conditions: [{ type: "eventCardIsSelf" }]`, then `action: "dealDamageEventSource"` with a `sourceFilter` for text like "when this Base receives battle damage from an enemy Unit with 3 or less AP, deal 1 damage to that Unit." Tests should use `resolveCombat({ target: "direct" })` for Base damage routing.
- **Destroying shield-area cards with battle damage**: use timing `onShieldAreaCardDestroyByBattle` with `conditions: [{ type: "isTurn", whose: "friendly" }, { type: "eventCardIsSelf" }]` for text like "when this Unit destroys an enemy shield area card with battle damage." Test with `resolveCombat({ target: "direct" })` and a seeded enemy shield or low-HP enemy Base.
- **Recovering the battle-destroy event Unit**: for observer text like "when a friendly <trait> Unit that is Lv.N or higher destroys an enemy Unit with battle damage, that friendly Unit may recover 2 HP", use timing `onDestroyByBattle`, gate with `eventCardMatches` for the attacker trait/level, and resolve `action: "recoverHPEventCard"`. Tests should damage the attacker first, resolve combat against a rested low-HP enemy Unit, then answer the optional with `resolveEffect({ optionalAnswers: { 0: true } })`.
- **This-turn delayed battle-destroy triggers**: for Command/Deploy text like "During this turn, if/when a friendly <trait> Unit destroys an enemy Unit with battle damage, ..." use `action: "createDelayedTrigger"` with `duration: "thisTurn"`, `eventType: "attackerDestroyedDefender"`, an `eventCardFilter` for the battle-destroying friendly Unit, and an embedded triggered `effect`. Example:
  ```ts
  {
    action: {
      action: "createDelayedTrigger",
      duration: "thisTurn",
      eventType: "attackerDestroyedDefender",
      eventCardFilter: {
        owner: "friendly",
        cardType: "unit",
        attributeFilters: [{ attribute: "trait", comparison: "includes", value: "<trait>" }],
      },
      effect: {
        type: "triggered",
        activation: { timing: ["onDestroyByBattle"] },
        directives: [{ action: { action: "setActive", target: { owner: "friendly", cardType: "unit", state: "rested", count: 1 } } }],
        sourceText: "During this turn, when ...",
      },
    },
  }
  ```
  Tests should play/deploy the source first, resolve a real unit-vs-unit combat where the matching attacker destroys a rested low-HP enemy Unit, and assert the delayed effect's observable result. Include a negative where the attacker lacks the trait and a cleanup check that `engine.endTurn()` removes the delayed trigger.
- **Paid Unit-effect cost triggers**: for "when you pay ① or more for a friendly Unit's effect", use timing `onUnitEffectCostPaid` with `conditions: [{ type: "isTurn", whose: "friendly" }, { type: "eventPlayerIsSelf" }, { type: "eventCardMatches", target: { owner: "friendly", cardType: "unit" } }]`. This timing is emitted only from activated Unit abilities that pay `cost.payResources > 0`, not from paying to play a Unit or Command.
- **Pairing observer triggers**: for "when you pair a Pilot with this Unit or one of your white Units", use timing `whenPaired` with `conditions: [{ type: "duringPair" }, { type: "eventPlayerIsSelf" }, { type: "eventCardMatches", target: { owner: "friendly", cardType: "unit", attributeFilters: [{ attribute: "color", comparison: "eq", value: "white" }] } }]`. The pairing event's `cardId` is the paired Unit instance, and the observer scan skips both the paired Unit and the newly paired Pilot so their own source triggers do not double-fire. Triggered `oncePerTurn` restrictions are tracked through `abilityUsesThisTurn`, the same turn-reset field used by activated abilities.
- **Returning a destroyed Unit's paired Pilot**: for "return this Unit's paired Pilot / the card paired with this Unit to hand" on `【Destroyed】`, use `action: "returnPairedPilotToHand"`. The destroy event carries `pairedPilotId` before cleanup moves the Pilot to trash, so tests should pair through `assignPilot`, capture `engine.getG().pilotAssignments[unitId]`, call `engine.destroyUnit(unitId)`, then assert the Unit is in trash and the Pilot is in hand.
- **Hand level/cost reduction by a board count**: for text like "this card in your hand gets Lv. -1 and cost -1 for each enemy Unit in play", use paired constant directives `levelReductionByCount` and `costReductionByCount` with `target: { owner: "self", cardType: "unit", zone: "hand" }` and a battle-area count filter such as `{ owner: "opponent", cardType: "unit" }`. Gate "while you have no Lv.6+ Units" with `cardInZone` plus `attributeFilters: [{ attribute: "level", comparison: "gte", value: 6 }]`.
- **Trash-zone self cost reduction**: for "this card in your trash gets cost -1", use `action: "costReduction"` with `amount: 1` and `target: { owner: "self", cardType: "unit", zone: "trash" }`. To test it end to end, deploy the card from trash through a real `deployFromTrash` effect with `payCost: true`, such as a Downes-style fixture, and size active resources so the reduced cost is payable but the printed cost is not.
- **Returning a fixed number of trash cards to deck as an attack cost/effect**: for text like "Choose 12 cards from your trash. Return them to their owner's deck and shuffle it. If you do, set this Unit as active. It gains <First Strike>", use `returnToDeck` with a trash-scoped target (`{ owner: "friendly", zone: "trash", count: 12 }`) and add a `cardInZone` condition requiring at least 12 friendly trash cards so the trigger does not fire short. Follow with dependent `setActive` and `grantKeyword` directives targeting `owner: "self"`. Tests should mark the Unit linked, enter battle, then assert trash decreases by 12, deck increases by 12, the attacker is active, and effective keywords include `FirstStrike`.
- **Highest-value targets**: for "choose 1 enemy Unit with the highest Lv.", use a normal target filter with `count: 1` and `highest: "level"`. Tests should include a lower-level enemy before the highest-level enemy in zone order to prove selection is not just first-candidate.
- **Targets that require multiple states**: use `state: ["damaged", "active"]` for text like "damaged active enemy Unit"; a single `state: "damaged"` or `state: "active"` only checks one predicate.
- **Optional deploy from trash with printed cost**: use `action: "deployFromTrash"` with `payCost: true`, `levelAtMost`, and a trash-scoped `target` filter:
  `{ owner: "friendly", cardType: "unit", zone: "trash", count: 1, attributeFilters: [{ attribute: "trait", comparison: "includes", value: "vagan" }, { attribute: "level", comparison: "lte", value: 4 }] }`.
  In tests, pass the desired trash card ID through the triggering deploy move's `targets`, then resolve the nested optional with `resolveEffect({ optionalAnswers: { 1: true } })`; assert the Unit moved to `battleArea` and the exhausted resource count includes both the Base cost and the deployed Unit cost.
- **Stat modifiers equal to a card count**: use `action: "statModifierByCount"` with `countFilter`, `stat`, `amountPerMatch`, `duration`, and `target`. Trait matching inside `TargetFilter` must use `attributeFilters: [{ attribute: "trait", comparison: "includes", value: "<trait>" }]`, not `hasTrait`.
- **Stat modifiers equal to unique card names**: for "AP by the number of <trait> Pilot/Command cards with unique names in your trash", use `action: "statModifierByUniqueNameCount"` with `countFilter: { owner: "friendly", zone: "trash", cardType: ["pilot", "command"], attributeFilters: [{ attribute: "trait", comparison: "includes", value: "<trait>" }] }`, `amountPerUniqueName: 1`, and `target: { owner: "self", cardType: "unit" }`. Tests should include duplicate names, a wrong-trait card, and a wrong-type card, then assert effective AP through `getEffectiveStats(...)`.
- **Passive counted stat modifiers**: when `statModifierByCount` appears on a constant/`duringLink` effect, assert the observable AP/HP through `getEffectiveStats(...)`; do not inspect the card data shape.
- **"If you have no EX Resources" gates**: encode as a `cardInZone` condition on friendly `resourceArea` resources with `hasName: "EX Resource"`, `comparison: "eq"`, and `count: 0`, then test both the no-EX and existing-EX cases.
- **"During your turn, if you have another <trait> Unit" gates**: combine `{ type: "isTurn", whose: "friendly" }` with a `unitCount` condition using `owner: "friendly"`, `hasTrait`, `excludeSelf: true`, `comparison: "gte"`, and `count: 1`. Cover both the missing-trait and opponent-turn negatives.
- **Attack permission gated by cards deployed this turn**: for "This Unit can only attack during a turn when one of your (A)/(B) Units is deployed", encode a constant `cantAttack` directive targeting `owner: "self"` and gate it with `deployedThisTurnCount` using `comparison: "eq"`, `count: 0`, `cardType: "unit"`, and an OR `attributeFilters` trait predicate for the allowed traits. Tests should pre-place the restricted Unit in play, assert `enterBattle(..., "direct")` fails before a matching deploy, then deploy a matching Unit and assert the same attacker succeeds.
- **Phase changes mid-test**: prefer `engine.setPhase` / `engine.setStep` over running through `passPhase()` loops; keeps test bodies short.
- **Hidden draws**: a fixture without `deck` injects placeholder cards. If your test asserts hand counts, pass an explicit `deck:` so the count is deterministic.
- **Deck top/bottom assertions**: the runtime draws from the end of the deck array. A card returned to the bottom should appear at `getCardsInZone("deck").at(0)`, while the top is `at(-1)`.

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
