---
name: "lorcana-test-generation"
description: "Generate focused Lorcana card-behavior tests using the current multiplayer test engine and helper syntax, and write minimal engine repro tests when a card exposes a suspected runtime gap."
---

# Lorcana Test Generation

Write focused Bun tests for Lorcana card behavior using the current engine helpers in `packages/lorcana/lorcana-cards`.

This skill is the **harness reference** for card tests. The full card lifecycle (authoring, debugging, engine extension) is owned by [`lorcana-cards`](../lorcana-cards/SKILL.md); invoke it for orchestration. This skill only answers "how do I write the test correctly using current harness syntax".

## Required Memory Step

1. Read [`memory/schema.md`](./memory/schema.md). It points to the canonical schema in `lorcana-cards/memory/schema.md`.
2. Read the **Guardrails** and **Promoted Rules** sections of [`memory/bank.md`](./memory/bank.md).
3. Apply guardrails before writing tests. After substantive work, follow the canonical Memory Update Protocol.

## Scope

- Use this skill for current test syntax across actions, items, characters, locations, and songs.
- Do not use skipped suites or `todo` stubs as syntax references.
- If the test file contains commented-out legacy code (prefixed with `// LEGACY IMPLEMENTATION`), understand it and replicate the behavior using current syntax.
- Keep tests narrow, semantic, and tied to printed behavior.
- A test that only asserts `missingImplementation`, `missingTests`, or an empty ability list is not valid coverage.
- When adapting a legacy test, preserve the legacy behavior claim and avoid strengthening it into a transport-level failure assertion unless the old test explicitly checked that failure mode.

## Enhanced Context

Use [`lorcana-find-card`](../lorcana-find-card/SKILL.md) to retrieve similar cards, passing `k` explicitly (default 10). Apply filters (`requireActiveTest: true` is almost always wanted) so the returned references are real coverage, not placeholder files. If the lookup takes more than 5 minutes, proceed with whatever was returned and append an Observation about the slow path.

## File Organization

Tests live alongside card definitions:

```
packages/lorcana/lorcana-cards/src/cards/{SET_NUMBER}/{CARD_TYPE}/{NUMBER}-{card-name}.test.ts
packages/lorcana/lorcana-cards/src/cards/{SET_NUMBER}/{CARD_TYPE}/{NUMBER}-{card-name}.ts        # definition
packages/lorcana/lorcana-cards/src/cards/{SET_NUMBER}/{CARD_TYPE}/{NUMBER}-{card-name}.i18n.ts   # i18n
```

Card types: `characters`, `items`, `actions`, `locations` (songs live under `actions`).

## Imports

Always import from `bun:test` and `@tcg/lorcana-engine/testing`:

```ts
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockItem,
  createMockAction,
  createMockLocation,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
```

Import the card under test from its definition file (relative path). Import other real cards from their set barrel exports when their identity matters.

## Harness Choice

### LorcanaMultiplayerTestEngine (default)

Use for all gameplay behavior tests: on-play effects, triggers, pending effects, chosen-player flows, response flows, bag triggers, songs, locations, challenges, quests, durations, and cross-turn checks.

```ts
const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
  playerOneState,       // TestInitialState
  playerTwoState?,      // TestInitialState (optional)
  options?,             // LorcanaFixtureInitOptions (optional)
);
```

### LorcanaTestEngine (narrow model checks only)

Use only for property/keyword verification that does not require gameplay flow:

```ts
import { LorcanaTestEngine } from "@tcg/lorcana-engine/testing";

const testEngine = new LorcanaTestEngine({ play: [cardUnderTest] });
expect(testEngine.getCardModel(cardUnderTest).hasBodyguard()).toBe(true);
```

## Fixture Setup (TestInitialState)

Each player state accepts:

| Field     | Type                    | Notes                                          |
| --------- | ----------------------- | ---------------------------------------------- |
| `hand`    | `number \| CardEntry[]` | Number = placeholder cards; array = real cards |
| `deck`    | `number \| CardEntry[]` | Same. Use `deck: []` to avoid hidden draws     |
| `play`    | `number \| CardEntry[]` | Cards in play zone                             |
| `inkwell` | `number \| CardEntry[]` | Number = amount of generic ink available       |
| `discard` | `number \| CardEntry[]` | Cards in discard pile                          |
| `lore`    | `number`                | Starting lore for the player                   |

### Card State in Fixtures

Cards in arrays can be plain card definitions or state objects:

```ts
// Plain card (ready, no damage, drying by default for new plays)
play: [myCharacter];

// Card with specific state
play: [
  { card: myCharacter, exerted: true, isDrying: false },
  { card: myLocation, damage: 2 },
  { card: characterAtLocation, atLocation: myLocation },
  { card: shiftedCard, cardsUnder: [baseCard] },
];
```

Available state properties:

- `exerted?: boolean` - whether card is exerted
- `isDrying?: boolean` - whether card is drying (default true for newly played characters; set `false` to make immediately usable)
- `damage?: number` - damage counters
- `lore?: number` - lore on card
- `cardsUnder?: CardDef[]` - cards stacked under (for Shift)
- `atLocation?: CardDef` - place character at a location
- `publicFaceState?: "faceUp" | "faceDown"` - visibility state

### Default Behavior

- If `deck` is omitted entirely, the harness injects 10 placeholder cards.
- Use `deck: []` when the test must avoid hidden draws.
- `inkwell: N` creates N generic ink (number shorthand).

## Mock Card Creators

Use when printed identity does not matter (helper characters, targets, fodder):

```ts
const ally = createMockCharacter({
  id: "test-ally", // unique id (prefix with card-under-test context)
  name: "Test Ally",
  cost: 2,
  strength: 3, // default: 2
  willpower: 4, // default: 5
  lore: 1, // default: 1
  inkable: true, // default: true
  classifications: ["Storyborn", "Hero"],
  abilities: [], // AbilityDefinition[]
  inkType: ["amber"], // default: ["amber"]
});

const item = createMockItem({ id: "test-item", name: "Test Item", cost: 2 });
const action = createMockAction({ id: "test-action", name: "Test Action", cost: 3 });
const location = createMockLocation({
  id: "test-location",
  name: "Test Location",
  cost: 3,
  moveCost: 1, // default: 1
  willpower: 4, // default: 4
  lore: 1, // default: 1
});
const song = createMockSong({
  id: "test-song",
  name: "Test Song",
  cost: 4,
  text: "Song text",
  abilities: [{ id: "st-kw", type: "keyword", keyword: "SingTogether", value: 5 }],
});
```

**ID naming convention**: Prefix mock IDs with the card-under-test slug to avoid collisions across test files. Example: `"spaghetti-dinner-diner-one"`.

## Quick Workflow

1. Read the printed text and current card definition.
2. Classify the interaction before writing:
   - simple chosen target
   - chosen player
   - modal choice
   - optional follow-up
   - activated extra cost (exert, ink, discard, banish)
   - opponent response
   - bag trigger
   - scry / reorder / split destinations
   - under-card selection
   - song / sing together
   - temporary duration across turns
   - shift / sacrifice alternative cost
   - static while-in-play buff
   - conditional effect (if you have X, then Y)
   - start-of-turn / end-of-turn trigger
3. Find at max 10 similar cards to ensure consistent test patterns.
4. Write one active test per real behavior clause.
5. If a clause appears blocked, expand the engine to support the expected behavior.
6. Use the smallest helper that matches the flow.
7. Prefer semantic matchers over raw internals.
8. Run the targeted test file first.
9. Activate stale skipped coverage instead of adding a parallel placeholder file.

Test behavior only. Do not add metadata snapshots or metadata-only blocker tests.

## Naming Conventions

```ts
describe("Card Name - Version", () => {
  // For vanilla cards: test stats and properties directly
  // For ability cards: one describe block per ability

  describe("ABILITY_NAME - Full printed ability text", () => {
    it("describes specific behavior being tested", () => { ... });
    it("does not trigger when [negative condition]", () => { ... });
    it("buff expires at end of turn", () => { ... });
    it("regression: [bug description]", () => { ... });
  });
});
```

**it() block conventions**:

- Use present tense: `"deals 3 damage"`, `"gains Evasive"`, `"draws a card"`
- Negative tests: `"does not trigger when..."`, `"cannot target opponent's character"`
- Duration: `"buff expires at end of turn"`, `"restriction persists through opponent's turn"`
- Regression: `"regression: [description of the bug]"`

## Player Handle API Reference

`testEngine.asPlayerOne()` and `testEngine.asPlayerTwo()` return `LorcanaClient` handles with these methods:

### Playing Cards

```ts
// Simple play (no targets needed or targets passed)
testEngine.asPlayerOne().playCard(card);
testEngine.asPlayerOne().playCard(card, { targets: [target1, target2] });

// Modal play (choose one of multiple modes, 0-indexed)
testEngine.asPlayerOne().playCardWithChoice(card, modeIndex);
testEngine.asPlayerOne().playCardWithChoice(card, modeIndex, { targets: [target] });

// Chosen player (card targets a specific player)
testEngine.asPlayerOne().playCardForPlayer(card, PLAYER_TWO);

// Scry / reorder destinations
testEngine
  .asPlayerOne()
  .playCardWithDestinations(
    card,
    { zone: "play", cards: cardToPlay },
    { zone: "deck-bottom", cards: [card1, card2] },
  );

// Shift cost
const shiftTarget = testEngine.findCardInstanceId(baseCard, "play", PLAYER_ONE);
testEngine.asPlayerOne().playCard(shifter, { cost: { cost: "shift", shiftTarget } });

// Sacrifice cost (banish item to play for free)
const sacrificeTarget = testEngine.findCardInstanceId(item, "play");
testEngine.asPlayerOne().playCard(card, { cost: { cost: "sacrifice", sacrificeTarget } });
```

### Songs

```ts
testEngine.asPlayerOne().singSong(songCard, singerCard);
testEngine.asPlayerOne().playSongTogether(songCard, [singerA, singerB]);
```

### Character Actions

```ts
// Quest
testEngine.asPlayerOne().quest(card);

// Challenge (attacker must be ready, defender must be exerted for characters)
testEngine.asPlayerOne().challenge(attacker, defender);

// Ink a card from hand
testEngine.asPlayerOne().ink(card);

// Move to location
testEngine.asPlayerOne().moveCharacterToLocation(character, location);

// Pass turn
testEngine.asPlayerOne().passTurn();
```

### Activated Abilities

```ts
// By ability name
testEngine.asPlayerOne().activateAbility(card, { ability: "ABILITY NAME" });

// With targets
testEngine.asPlayerOne().activateAbility(card, { ability: "NAME", targets: [target] });

// With costs
testEngine.asPlayerOne().activateAbility(card, {
  costs: { discardCards: [cardToDiscard] },
});
testEngine.asPlayerOne().activateAbility(card, {
  costs: { exertCharacters: [charToExert] },
});
testEngine.asPlayerOne().activateAbility(card, {
  costs: { banishItems: [itemToBanish] },
});
```

Use only the cost key the card actually needs.

### Effect Resolution

```ts
// Resolve pending effect tied to a specific card
testEngine.asPlayerOne().resolvePendingByCard(card, { resolveOptional: true });
testEngine.asPlayerOne().resolvePendingByCard(card, { resolveOptional: true, targets: [target] });
testEngine.asPlayerOne().resolvePendingByCard(card, { resolveOptional: false }); // decline optional
testEngine.asPlayerOne().resolvePendingByCard(card, { namedCard: "Simba" });

// Resolve a specific pending effect by ID
const [effect] = testEngine.asPlayerOne().getPendingEffects();
testEngine.asPlayerOne().resolveEffect(effect.id, { targets: [PLAYER_TWO] });

// Resolve the next pending choice/response
testEngine.asPlayerTwo().resolveNextPending({ choiceIndex: 1 });
testEngine.asPlayerTwo().resolveNextPending({
  destinations: [
    { zone: "deck-top", cards: [card1] },
    { zone: "deck-bottom", cards: [card2, card3] },
  ],
});

// Respond with card(s)
testEngine.asPlayerTwo().respondWith(target);
testEngine.asPlayerTwo().respondWith(cardInstanceId);
testEngine.asPlayerTwo().respondWithChoice(0); // modal choice index
```

### Bag Triggers

```ts
// Check bag count
testEngine.asPlayerOne().getBagCount();

// Get and resolve bag effects
const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
testEngine.asPlayerOne().resolveBag(bagEffect.id, { resolveOptional: true });
testEngine.asPlayerOne().resolveBag(bagEffect.id, { resolveOptional: true, targets: [target] });

// Shorthand: resolve the only bag effect
testEngine.asPlayerOne().resolveOnlyBag({ targets: [target] });
testEngine.asPlayerOne().resolveOnlyBag({ resolveOptional: true });
```

### State Queries

```ts
// Card properties
testEngine.asPlayerOne().getCard(card); // → LorcanaProjectedCard
testEngine.asPlayerOne().getCardZone(card); // → "hand" | "play" | "deck" | "discard" | "inkwell"
testEngine.asPlayerOne().getCardStrength(card); // → number
testEngine.asPlayerOne().getCardLore(card); // → number (lore stat on card)
testEngine.asPlayerOne().getDamage(card); // → number
testEngine.asPlayerOne().isExerted(card); // → boolean
testEngine.asPlayerOne().hasKeyword(card, "Evasive"); // → boolean
testEngine.asPlayerOne().getKeywordValue(card, "Resist"); // → number | null

// Zone counts
testEngine.asPlayerOne().getZonesCardCount(); // → { hand, deck, play, inkwell, discard }

// Player lore
testEngine.getLore(PLAYER_ONE); // → number (player's total lore)

// Pending effects
testEngine.asPlayerOne().getPendingEffects(); // → PendingEffect[]
testEngine.asPlayerOne().getBagCount(); // → number
testEngine.asPlayerOne().getBagEffects(); // → BagEffect[]

// Instance resolution (for duplicates or cross-zone lookups)
testEngine.findCardInstanceId(card, "discard", "p1"); // → CardInstanceId
testEngine.findCardInstanceId(card, "play", PLAYER_ONE);
testEngine.findCardInstanceId(card, "hand"); // defaults to active player

// Server-side queries
testEngine.asServer().getAvailableInk(PLAYER_ONE); // → number
testEngine.asServer().manualSetDamage(card, 3); // manually set damage
testEngine.getAuthoritativeState(); // → full server state
testEngine.getCardDefinitionIdsInZone("deck", PLAYER_TWO); // → string[]
testEngine.getCardInstanceIdsInZone("play", PLAYER_ONE); // → CardInstanceId[]
```

## Custom Matchers Reference

All matchers are auto-registered via `bunfig.toml` preload. These are the **exact** signatures:

### Command Matchers

```ts
// Verify a move/command succeeded
expect(result).toBeSuccessfulCommand();
expect(result).not.toBeSuccessfulCommand();
```

### Zone Matchers (receiver: card object from getCard())

```ts
expect(testEngine.asPlayerOne().getCard(card)).toBeInZone("discard");
expect(testEngine.asPlayerOne().getCard(card)).toBeInPosition(1);
```

### Zone Count Matchers (receiver: LorcanaClient)

```ts
// Partial zone counts - only assert the zones you care about
expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 2, deck: 3 });
expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1, play: 3, discard: 1 });

// Specific zone + player count (receiver: LorcanaClient or LorcanaServer)
expect(testEngine.asServer()).toHaveCardCountInZone({ zone: "hand", player: PLAYER_ONE, count: 3 });
```

### Card State Matchers (receiver: LorcanaClient)

```ts
expect(testEngine.asPlayerOne()).toBeExerted(card);
expect(testEngine.asPlayerOne()).toBeReady(card);
expect(testEngine.asPlayerOne()).toHaveDamage({ card, value: 3 });
expect(testEngine.asPlayerOne()).toHaveLore({ card, value: 2 });
expect(testEngine.asPlayerOne()).toHaveCardsUnder({ card, count: 1 });
```

Where `card` is the **LorcanaProjectedCard** from `testEngine.asPlayerOne().getCard(cardDef)`.

### Keyword/Ability Matchers (receiver: LorcanaClient)

```ts
expect(testEngine.asPlayerOne()).toHaveKeyword({ card, keyword: "Evasive" });
expect(testEngine.asPlayerOne()).toHaveKeyword({ card, keyword: "Resist", value: 2 });
expect(testEngine.asPlayerOne()).not.toHaveKeyword({ card, keyword: "Evasive" });
expect(testEngine.asPlayerOne()).toHaveRestriction({ card, restriction: "cant-quest" });
expect(testEngine.asPlayerOne()).toHaveGrantedAbility({ card, ability: "Rush" });
```

### Location Matchers (receiver: LorcanaClient)

```ts
expect(testEngine.asPlayerOne()).toBeAtLocation({ card: character, location: locationCard });
```

### Effect Matchers (receiver: LorcanaClient)

```ts
expect(testEngine.asPlayerOne()).toHavePendingEffectCount(1);
```

### Game State Matchers (receiver: LorcanaClient or LorcanaServer)

```ts
expect(testEngine.asServer()).toHavePriorityPlayer(PLAYER_ONE);
expect(testEngine.asServer()).toBeInPhase("main");
expect(testEngine.asServer()).toBeInGameSegment("gameplay");
```

## Common Test Patterns

### Vanilla Card (no abilities)

```ts
describe("Card Name - Version", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(card.vanilla).toBe(true);
    expect(card.abilities).toBeUndefined();
  });

  it("has correct stats", () => {
    expect(card.cost).toBe(2);
    expect(card.strength).toBe(3);
    expect(card.willpower).toBe(2);
    expect(card.lore).toBe(1);
  });
});
```

### On-Play Effect with Targets

```ts
it("deals 1 damage each to up to 2 chosen characters", () => {
  const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [actionCard], inkwell: actionCard.cost },
    { play: [target1, target2, target3] },
  );

  expect(
    testEngine.asPlayerOne().playCard(actionCard, { targets: [target1, target2] }),
  ).toBeSuccessfulCommand();

  expect(testEngine.asPlayerTwo().getDamage(target1)).toBe(1);
  expect(testEngine.asPlayerTwo().getDamage(target2)).toBe(1);
  expect(testEngine.asPlayerTwo().getDamage(target3)).toBe(0);
});
```

### Activated Ability with Condition

```ts
it("gains 1 lore if you have 2 or more characters in play", () => {
  const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
    inkwell: 1,
    play: [itemCard, dinerOne, dinerTwo],
  });

  expect(
    testEngine.asPlayerOne().activateAbility(itemCard, { ability: "FINE DINING" }),
  ).toBeSuccessfulCommand();

  expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
});
```

### Challenge Mechanics

```ts
it("protects characters with 7+ strength from damage", () => {
  const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [
        { card: protector, isDrying: false },
        { card: bigCharacter, exerted: true, isDrying: false },
      ],
    },
    { play: [{ card: attacker, isDrying: false }] },
  );

  expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(testEngine.asPlayerTwo().challenge(attacker, bigCharacter)).toBeSuccessfulCommand();
  expect(testEngine.asPlayerOne().getDamage(bigCharacter)).toBe(0);
});
```

### Bag Trigger (Support, Quest Triggers)

```ts
it("adds strength to another chosen character when questing", () => {
  const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [{ card: supporter, isDrying: false }, ally],
    deck: 1,
  });

  expect(testEngine.asPlayerOne().quest(supporter)).toBeSuccessfulCommand();
  expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

  expect(
    testEngine.asPlayerOne().resolveOnlyBag({ resolveOptional: true, targets: [ally] }),
  ).toBeSuccessfulCommand();

  expect(testEngine.asPlayerOne().getCardStrength(ally)).toBe(ally.strength + supporter.strength);
});
```

### Cross-Turn Duration

```ts
it("keyword expires at start of your next turn", () => {
  // ... setup and grant keyword ...

  expect(testEngine.asPlayerOne()).toHaveKeyword({ card: target, keyword: "Evasive" });

  // Opponent's turn - keyword persists
  expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(testEngine.asPlayerOne()).toHaveKeyword({ card: target, keyword: "Evasive" });

  // Opponent passes - back to your turn, keyword should expire
  expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(testEngine.asPlayerOne()).not.toHaveKeyword({ card: target, keyword: "Evasive" });
});
```

### Shift Alternative Cost

```ts
it("reduces shift cost by 1 when in play", () => {
  const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [costReducer, shiftBase],
    hand: [shifterCard],
    inkwell: 10,
    deck: 5,
  });

  const shiftTarget = testEngine.findCardInstanceId(shiftBase, "play", PLAYER_ONE);

  expect(
    testEngine.asPlayerOne().playCard(shifterCard, { cost: { cost: "shift", shiftTarget } }),
  ).toBeSuccessfulCommand();

  expect(testEngine.asPlayerOne().getCardZone(shifterCard)).toBe("play");
  expect(testEngine.asServer().getAvailableInk(PLAYER_ONE)).toBe(5); // verify reduced cost
});
```

### Sacrifice Alternative Cost

```ts
it("can be played for free by banishing an item you control", () => {
  const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [card],
    play: [itemToSacrifice],
    inkwell: 0,
  });
  const sacrificeTarget = testEngine.findCardInstanceId(itemToSacrifice, "play");

  expect(
    testEngine.asPlayerOne().playCard(card, { cost: { cost: "sacrifice", sacrificeTarget } }),
  ).toBeSuccessfulCommand();

  expect(testEngine.asPlayerOne().getCard(itemToSacrifice).zone).toBe("discard");
  expect(testEngine.asPlayerOne().getCard(card).zone).toBe("play");
});
```

### Static While-in-Play Buff

```ts
it("gets +2 strength while an item is in your discard", () => {
  const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [buffedCharacter],
    discard: [item],
    deck: 5,
  });

  expect(testEngine.asPlayerOne().getCardStrength(buffedCharacter)).toBe(
    buffedCharacter.strength + 2,
  );
});

it("stays at base strength without an item in discard", () => {
  const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [buffedCharacter],
    deck: 5,
  });

  expect(testEngine.asPlayerOne().getCardStrength(buffedCharacter)).toBe(buffedCharacter.strength);
});
```

### Opponent-Triggered Reactive Ability

```ts
it("draws a card when an opponent targets it with an action", () => {
  const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [reactiveCharacter], deck: 5 },
    { hand: [opponentAction], inkwell: opponentAction.cost },
  );

  expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(
    testEngine.asPlayerTwo().playCard(opponentAction, { targets: [reactiveCharacter] }),
  ).toBeSuccessfulCommand();

  expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
  expect(
    testEngine.asPlayerOne().resolvePendingByCard(reactiveCharacter, { resolveOptional: true }),
  ).toBeSuccessfulCommand();

  expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1, deck: 4 });
});
```

### Location with Characters

```ts
it("triggers ability when character is at location", () => {
  const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [myLocation, { card: visitingCharacter, atLocation: myLocation }],
    deck: 1,
  });

  // ... test location-related behavior
});
```

### Negative Tests

```ts
it("does not reduce shift cost for opponent", () => {
  // ... setup with reducer on player one's board
  expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

  expect(
    testEngine.asPlayerTwo().playCard(shifter, { cost: { cost: "shift", shiftTarget } }),
  ).not.toBeSuccessfulCommand();

  expect(testEngine.asPlayerTwo().getCardZone(shifter)).toBe("hand");
});

it("cannot sacrifice an item you don't control", () => {
  const opponentItemId = testEngine.findCardInstanceId(opponentItem, "play", "player_two");

  expect(
    testEngine
      .asPlayerOne()
      .playCard(card, { cost: { cost: "sacrifice", sacrificeTarget: opponentItemId } }),
  ).not.toBeSuccessfulCommand();
});
```

## Pitfalls

- **isDrying**: Characters are drying by default when placed in play via fixture. Set `isDrying: false` if the test needs them to quest, challenge, or use abilities immediately.
- **exerted for defenders**: Defenders must be `exerted: true` for characters to challenge them.
- **Chosen-player cards**: Use `playCardForPlayer(...)`. Responder-side choices resolve with `asPlayerTwo().resolveNextPending(...)`.
- **upTo / zero-target branches**: Assert the legal minimal target bundle the runtime accepts rather than forcing dummy selections.
- **Hidden zones**: When a card moves into a hidden zone, prefer zone counts or authoritative state over direct player-view identity assertions.
- **"that character" references**: Tests should follow implementations that reuse the prior chosen target instead of re-selecting a fresh card.
- **Bag-trigger tests**: Assert both bag count and post-resolution state.
- **Songs, hand/discard, under-card, duplicates**: Often require runtime IDs from `findCardInstanceId(...)`.
- **Priority after passTurn**: After `asPlayerOne().passTurn()`, it's player two's turn. After both pass, a new turn starts for player one.
- **getLore receiver**: `testEngine.getLore(PLAYER_ONE)` is on the test engine directly, not on the player handle.
- **Matcher receivers**: `toHaveZoneCounts`, `toHaveKeyword`, `toBeExerted` etc. take `LorcanaClient` as receiver (from `asPlayerOne()`), while `toHaveCardCountInZone`, `toBeInPhase` also accept `LorcanaServer` (from `asServer()`).
- **Card for matchers**: Some matchers like `toBeExerted(card)` expect a `LorcanaProjectedCard` from `getCard()`, while `toHaveKeyword({ card, keyword })` accepts card defs directly in the `card` field.

## Blocker Tests

- Keep card-package tests focused on printed gameplay behavior.
- If the suspected blocker is inside `lorcana-engine`, prefer a minimal engine or simulator repro near the affected resolver, targeting, activation, or trigger code.
- A blocker report without a behavior repro is not complete enough to justify leaving the card blocked.
- Use authoritative deck, discard, pending-effect, and zone-order assertions for reveal and hidden-zone flows.

## Important

- Don't test card's raw printed values alone (like `"should have correct stats and abilities"`) unless the card is vanilla.
- Every non-vanilla test should exercise actual gameplay behavior.
- Prefer `.toBeSuccessfulCommand()` over `.success === true` (but both work).
- Use `createMockCharacter` for test helpers, real card definitions when identity matters.

## Verification

1. Run the targeted test file first: `bun test path/to/card.test.ts`
2. If the change is test-only or documentation-only, stop at targeted verification.
3. If the test unlocks broader implementation work and the targeted run passes, follow the repo rule for wider checks.

## Sample Prompt

Use this when you want another agent to create or update a card test:

```md
Use `lorcana-test-generation`.

Create or update the test for `<CARD_NAME>` in `packages/lorcana/lorcana-cards`.

Requirements:

- If the engine does not support yet the card, we must expand the current engine to ensure it supports the card.
- Find the card definition first and use the matching active local test file if it exists.
- Use only current patterns from `@tcg/lorcana-engine/testing`.
- Write focused Bun behavior tests for the printed card text only.
- Prefer `LorcanaMultiplayerTestEngine` unless this is only a narrow keyword/model check.
- Use semantic matchers like `toHaveZoneCounts`, `toHaveLore`, `toHaveKeyword`, `toHaveRestriction`, `toHaveGrantedAbility`, `toBeAtLocation`, or `toHavePendingEffectCount` when possible.
- If the card has pending choices, chosen-player flow, bag triggers, or cross-turn duration, use the current helper APIs as appropriate.
- Run only the targeted test file after editing.
- Do not run repo-wide checks unless the targeted test passes and broader verification is clearly needed.

Success criteria:

- The test is active, uses current syntax, and proves the real printed behavior of the card.
- The targeted Bun test passes.
```
