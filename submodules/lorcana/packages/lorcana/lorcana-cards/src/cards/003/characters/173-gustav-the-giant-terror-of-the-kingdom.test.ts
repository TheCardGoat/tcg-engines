import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { dragonFire } from "../../001/actions/130-dragon-fire";
import { gustavTheGiantTerrorOfTheKingdom } from "./173-gustav-the-giant-terror-of-the-kingdom";

const friendlyAttacker = createMockCharacter({
  id: "gustav-test-friendly-attacker",
  name: "Friendly Attacker",
  cost: 2,
  strength: 3,
  willpower: 4,
  lore: 1,
});

const defendingAlly = createMockCharacter({
  id: "gustav-test-defending-ally",
  name: "Defending Ally",
  cost: 2,
  strength: 4,
  willpower: 5,
  lore: 1,
});

const weakOpponent = createMockCharacter({
  id: "gustav-test-weak-opponent",
  name: "Weak Opponent",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
});

const invadingOpponent = createMockCharacter({
  id: "gustav-test-invading-opponent",
  name: "Invading Opponent",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Gustav the Giant - Terror of the Kingdom", () => {
  describe("ALL TIED UP - This character enters play exerted and can't ready at the start of your turn.", () => {
    it("enters play exerted and stays exerted through its controller's ready step", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [gustavTheGiantTerrorOfTheKingdom],
          inkwell: gustavTheGiantTerrorOfTheKingdom.cost,
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(gustavTheGiantTerrorOfTheKingdom),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(gustavTheGiantTerrorOfTheKingdom)).toBe(true);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(gustavTheGiantTerrorOfTheKingdom)).toBe(true);
    });
  });

  describe("BREAK FREE - During your turn, whenever one of your other characters banishes another character in a challenge, you may ready this character.", () => {
    it("readies Gustav when another friendly character banishes in a challenge during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: gustavTheGiantTerrorOfTheKingdom, exerted: true, isDrying: false },
            { card: friendlyAttacker, isDrying: false },
          ],
          deck: 1,
        },
        {
          play: [{ card: weakOpponent, exerted: true, isDrying: false }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(friendlyAttacker, weakOpponent),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardZone(weakOpponent)).toBe("discard");

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(gustavTheGiantTerrorOfTheKingdom)).toBe(false);
    });

    it("does not trigger when another friendly character banishes outside a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: gustavTheGiantTerrorOfTheKingdom, exerted: true, isDrying: false }],
          hand: [dragonFire],
          inkwell: dragonFire.cost,
          deck: 1,
        },
        {
          play: [weakOpponent],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(dragonFire, { targets: [weakOpponent] }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardZone(weakOpponent)).toBe("discard");

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().isExerted(gustavTheGiantTerrorOfTheKingdom)).toBe(true);
    });

    it("does not trigger when another friendly character banishes in a challenge during the opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: gustavTheGiantTerrorOfTheKingdom, exerted: true, isDrying: false },
            { card: defendingAlly, exerted: true, isDrying: false },
          ],
          deck: 1,
        },
        {
          play: [{ card: invadingOpponent, isDrying: false }],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerTwo().challenge(invadingOpponent, defendingAlly),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardZone(invadingOpponent)).toBe("discard");

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().isExerted(gustavTheGiantTerrorOfTheKingdom)).toBe(true);
    });
  });
});
