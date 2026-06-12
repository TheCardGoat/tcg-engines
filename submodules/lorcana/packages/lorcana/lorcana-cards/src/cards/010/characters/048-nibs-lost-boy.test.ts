import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { nibsLostBoy } from "./048-nibs-lost-boy";
import { dragonFire } from "../actions/133-dragon-fire";

const strongCharacter = createMockCharacter({
  id: "nibs-test-strong",
  name: "Strong Character",
  cost: 8,
  strength: 8,
  willpower: 8,
});

describe("Nibs - Lost Boy", () => {
  describe("LOOK WHO'S BACK - When this character is banished in a challenge, return this card to your hand.", () => {
    it("should NOT return to hand when banished outside a challenge (e.g., Dragon Fire)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [nibsLostBoy],
          deck: 2,
        },
        {
          hand: [dragonFire],
          inkwell: dragonFire.cost,
          deck: 2,
        },
      );

      testEngine.asPlayerOne().passTurn();

      expect(
        testEngine.asPlayerTwo().playCard(dragonFire, { targets: [nibsLostBoy] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(nibsLostBoy)).toBe("discard");
    });

    it("as an attacker, should return to hand when banished in a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [nibsLostBoy],
          deck: 2,
        },
        {
          play: [{ card: strongCharacter, exerted: true }],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(nibsLostBoy, strongCharacter),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(nibsLostBoy)).toBe("hand");
      expect(testEngine.asPlayerTwo()).toHaveDamage({
        card: strongCharacter,
        value: nibsLostBoy.strength,
      });
    });

    it("as a defender, should return to hand when banished in a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: nibsLostBoy, exerted: true }],
          deck: 2,
        },
        {
          play: [strongCharacter],
          deck: 2,
        },
      );

      testEngine.asPlayerOne().passTurn();

      expect(
        testEngine.asPlayerTwo().challenge(strongCharacter, nibsLostBoy),
      ).toBeSuccessfulCommand();

      // Mandatory triggered ability queued in bag for defender
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(nibsLostBoy, {}),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(nibsLostBoy)).toBe("hand");
      expect(testEngine.asPlayerTwo()).toHaveDamage({
        card: strongCharacter,
        value: nibsLostBoy.strength,
      });
    });
  });
});
