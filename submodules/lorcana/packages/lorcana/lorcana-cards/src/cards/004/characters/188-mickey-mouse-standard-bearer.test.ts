import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mickeyMouseStandardBearer } from "./188-mickey-mouse-standard-bearer";

const chosenCharacter = createMockCharacter({
  id: "standard-bearer-chosen-char",
  name: "Chosen Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const defender = createMockCharacter({
  id: "standard-bearer-defender",
  name: "Defender",
  cost: 3,
  strength: 2,
  willpower: 6,
});

describe("Mickey Mouse - Standard Bearer", () => {
  it("has the expected printed metadata", () => {
    expect(mickeyMouseStandardBearer).toMatchObject({
      id: "IJ9",
      cardType: "character",
      name: "Mickey Mouse",
      version: "Standard Bearer",
      set: "004",
      cardNumber: 188,
      cost: 2,
      strength: 1,
      willpower: 3,
      lore: 1,
      inkable: true,
    });
  });

  describe("STAND STRONG — When you play this character, chosen character gains Challenger +2 this turn.", () => {
    it("gives Challenger +2 to chosen character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [mickeyMouseStandardBearer],
          inkwell: mickeyMouseStandardBearer.cost,
          play: [chosenCharacter],
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(mickeyMouseStandardBearer)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(mickeyMouseStandardBearer, {
          resolveOptional: true,
          targets: [chosenCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: chosenCharacter,
        keyword: "Challenger",
        value: 2,
      });
    });

    it("the Challenger +2 bonus increases damage dealt when challenging", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [mickeyMouseStandardBearer],
          inkwell: mickeyMouseStandardBearer.cost,
          play: [chosenCharacter],
          deck: 1,
        },
        {
          play: [{ card: defender, exerted: true }],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(mickeyMouseStandardBearer)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(mickeyMouseStandardBearer, {
          resolveOptional: true,
          targets: [chosenCharacter],
        }),
      ).toBeSuccessfulCommand();

      // With Challenger +2, chosen character deals 2+2=4 damage when challenging
      const preview = testEngine.asPlayerOne().previewChallenge(chosenCharacter, defender);
      expect(preview?.attackerDamageDealt).toBe(chosenCharacter.strength + 2);
    });

    it("Challenger +2 expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [mickeyMouseStandardBearer],
          inkwell: mickeyMouseStandardBearer.cost,
          play: [chosenCharacter],
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(mickeyMouseStandardBearer)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(mickeyMouseStandardBearer, {
          resolveOptional: true,
          targets: [chosenCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: chosenCharacter,
        keyword: "Challenger",
        value: 2,
      });

      // End the turn and begin next turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // After the turn ends, the Challenger bonus should be gone
      expect(testEngine.asPlayerOne()).not.toHaveKeyword({
        card: chosenCharacter,
        keyword: "Challenger",
      });
    });

    it("can target Mickey Mouse Standard Bearer himself with STAND STRONG", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [mickeyMouseStandardBearer],
          inkwell: mickeyMouseStandardBearer.cost,
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(mickeyMouseStandardBearer)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Mickey can target himself
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(mickeyMouseStandardBearer, {
          resolveOptional: true,
          targets: [mickeyMouseStandardBearer],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: mickeyMouseStandardBearer,
        keyword: "Challenger",
        value: 2,
      });
    });

    it("can target an opponent's character with STAND STRONG", () => {
      const opponentCharacter = createMockCharacter({
        id: "standard-bearer-opponent-char",
        name: "Opponent Character",
        cost: 2,
        strength: 2,
        willpower: 3,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [mickeyMouseStandardBearer],
          inkwell: mickeyMouseStandardBearer.cost,
          deck: 1,
        },
        {
          play: [opponentCharacter],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(mickeyMouseStandardBearer)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // The effect targets "any" character, so opponent character is valid
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(mickeyMouseStandardBearer, {
          resolveOptional: true,
          targets: [opponentCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo()).toHaveKeyword({
        card: opponentCharacter,
        keyword: "Challenger",
        value: 2,
      });
    });
  });
});
