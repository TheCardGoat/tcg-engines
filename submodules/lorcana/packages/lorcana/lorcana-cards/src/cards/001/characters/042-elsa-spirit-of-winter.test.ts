import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { elsaSpiritOfWinter } from "./042-elsa-spirit-of-winter";

const opponentCharacterOne = createMockCharacter({
  id: "elsa-sow-opp-char-1",
  name: "Opponent Character One",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const opponentCharacterTwo = createMockCharacter({
  id: "elsa-sow-opp-char-2",
  name: "Opponent Character Two",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
});

describe("Elsa - Spirit of Winter", () => {
  it("has Shift keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [elsaSpiritOfWinter],
    });

    expect(testEngine.asPlayerOne().hasKeyword(elsaSpiritOfWinter, "Shift")).toBe(true);
  });

  describe("DEEP FREEZE — When you play this character, exert up to 2 chosen characters. They can't ready at the start of their next turn.", () => {
    it("exerts 1 chosen opposing character and prevents them from readying at start of their next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [elsaSpiritOfWinter],
          inkwell: elsaSpiritOfWinter.cost,
          deck: 2,
        },
        {
          play: [opponentCharacterOne],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(elsaSpiritOfWinter)).toBeSuccessfulCommand();

      // Triggered ability should be on the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

      // Resolve the triggered ability targeting 1 opponent character
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(elsaSpiritOfWinter, { targets: [opponentCharacterOne] }),
      ).toBeSuccessfulCommand();

      // Character should be exerted
      expect(testEngine.asPlayerTwo().isExerted(opponentCharacterOne)).toBe(true);

      // Pass player one's turn — at start of player two's turn, character should NOT ready
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().isExerted(opponentCharacterOne)).toBe(true);

      // Pass player two's turn — character should still be exerted on P1's turn start
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().isExerted(opponentCharacterOne)).toBe(true);

      // Pass player one's turn again — now it's P2's second turn — restriction should have expired
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().isExerted(opponentCharacterOne)).toBe(false);
    });

    it("exerts 2 chosen characters and prevents both from readying at start of their next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [elsaSpiritOfWinter],
          inkwell: elsaSpiritOfWinter.cost,
          deck: 2,
        },
        {
          play: [opponentCharacterOne, opponentCharacterTwo],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(elsaSpiritOfWinter)).toBeSuccessfulCommand();

      // Resolve the triggered ability targeting both opponent characters
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(elsaSpiritOfWinter, {
          targets: [opponentCharacterOne, opponentCharacterTwo],
        }),
      ).toBeSuccessfulCommand();

      // Both characters should be exerted
      expect(testEngine.asPlayerTwo().isExerted(opponentCharacterOne)).toBe(true);
      expect(testEngine.asPlayerTwo().isExerted(opponentCharacterTwo)).toBe(true);

      // Pass player one's turn — neither should ready at start of player two's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().isExerted(opponentCharacterOne)).toBe(true);
      expect(testEngine.asPlayerTwo().isExerted(opponentCharacterTwo)).toBe(true);

      // Pass player two's turn — still exerted on P1's turn start
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().isExerted(opponentCharacterOne)).toBe(true);
      expect(testEngine.asPlayerTwo().isExerted(opponentCharacterTwo)).toBe(true);

      // Pass player one's turn — now it's P2's second turn — both should ready
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().isExerted(opponentCharacterOne)).toBe(false);
      expect(testEngine.asPlayerTwo().isExerted(opponentCharacterTwo)).toBe(false);
    });

    it("applies cant-ready restriction to the targeted character (active on their next turn)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [elsaSpiritOfWinter],
          inkwell: elsaSpiritOfWinter.cost,
          deck: 2,
        },
        {
          play: [opponentCharacterOne],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(elsaSpiritOfWinter)).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(elsaSpiritOfWinter, { targets: [opponentCharacterOne] }),
      ).toBeSuccessfulCommand();

      // Pass to P2's turn — now the restriction is active (their-next-turn = turn 2)
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // On P2's turn, the restriction should be active
      expect(testEngine.asPlayerTwo()).toHaveRestriction({
        card: opponentCharacterOne,
        restriction: "cant-ready",
      });

      // Character should still be exerted (restriction prevented readying)
      expect(testEngine.asPlayerTwo().isExerted(opponentCharacterOne)).toBe(true);
    });

    it("can target 0 characters (up to 2 means 0 is valid)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [elsaSpiritOfWinter],
          inkwell: elsaSpiritOfWinter.cost,
          deck: 2,
        },
        {
          play: [opponentCharacterOne],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(elsaSpiritOfWinter)).toBeSuccessfulCommand();

      // Resolve bag with no targets (choose 0)
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(elsaSpiritOfWinter, { targets: [] }),
      ).toBeSuccessfulCommand();

      // Character should not be exerted
      expect(testEngine.asPlayerTwo().isExerted(opponentCharacterOne)).toBe(false);
    });

    // Regression: player bug report (bugrepIH1PlKU7d84kUUJqGhIwY) — self-targeted Elsa
    // was exerted by DEEP FREEZE but readied on her controller's next turn, meaning the
    // cant-ready restriction was not applied to the chosen target.
    it("applies cant-ready to self-targeted Elsa (owner: any allows selecting your own character)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [elsaSpiritOfWinter],
        inkwell: elsaSpiritOfWinter.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(elsaSpiritOfWinter)).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(elsaSpiritOfWinter, { targets: [elsaSpiritOfWinter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(elsaSpiritOfWinter)).toBe(true);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(elsaSpiritOfWinter)).toBe(true);
    });

    // Regression: bug-38 (2026-04-22) — DEEP FREEZE encodes exert + cant-ready as a
    // sequence with two independent "chosen" selectors. Before the engine fixes, a
    // single `resolveBag` with targets:[] would suspend on step 0's target picker,
    // and each follow-up resolveEffect with targets:[] would re-suspend the
    // replay into a fresh pending-action — an infinite chain.
    //
    // Fixes in the engine:
    //   - resolve-bag sets `targetSelectionResolved` when the player explicitly
    //     submits targets:[] for an "up to N" effect.
    //   - maybeSuspendForChosenTargets honors that flag + minSelections===0 to
    //     skip re-suspending downstream steps that would read the same selection.
    // Result: one resolveBag with targets:[] fully drains the sequence with no
    // leftover pending-action, bag item, or pending choice.
    it("resolves DEEP FREEZE with targets:[] in a single call on an otherwise-empty board", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [elsaSpiritOfWinter],
          inkwell: elsaSpiritOfWinter.cost,
          deck: 2,
        },
        { deck: 2 },
      );

      expect(testEngine.asPlayerOne().playCard(elsaSpiritOfWinter)).toBeSuccessfulCommand();

      // Exactly one prompt — the shared "up to 2" selection — resolved with 0
      // targets fully drains the sequence: no follow-up pending-action appears.
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(elsaSpiritOfWinter, { targets: [] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
      expect(testEngine.asPlayerOne().getPendingChoice()).toBeUndefined();
      expect(testEngine.asPlayerOne().isExerted(elsaSpiritOfWinter)).toBe(false);
    });

    it("applies cant-ready to both targets when mixing self and opposing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [elsaSpiritOfWinter],
          inkwell: elsaSpiritOfWinter.cost,
          deck: 2,
        },
        {
          play: [opponentCharacterOne],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(elsaSpiritOfWinter)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(elsaSpiritOfWinter, {
          targets: [elsaSpiritOfWinter, opponentCharacterOne],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(elsaSpiritOfWinter)).toBe(true);
      expect(testEngine.asPlayerTwo().isExerted(opponentCharacterOne)).toBe(true);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().isExerted(opponentCharacterOne)).toBe(true);

      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(elsaSpiritOfWinter)).toBe(true);
    });
  });
});
