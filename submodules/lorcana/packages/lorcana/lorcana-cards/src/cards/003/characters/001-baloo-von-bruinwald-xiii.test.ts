import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { balooVonBruinwaldXiii } from "./001-baloo-von-bruinwald-xiii";

const strongAttacker = createMockCharacter({
  id: "baloo-test-attacker",
  name: "Strong Attacker",
  cost: 3,
  strength: 5,
  willpower: 5,
});

describe("Baloo - von Bruinwald XIII", () => {
  it("has Bodyguard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [balooVonBruinwaldXiii],
        deck: 1,
      },
      {
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().hasKeyword(balooVonBruinwaldXiii, "Bodyguard")).toBe(true);
  });

  describe("LET'S MAKE LIKE A TREE - When this character is banished, gain 2 lore.", () => {
    it("gains 2 lore when banished in a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: balooVonBruinwaldXiii, exerted: true }],
          deck: 1,
        },
        {
          play: [strongAttacker],
          deck: 1,
        },
      );

      // Pass turn so player two can challenge
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(
        testEngine.asPlayerTwo().challenge(strongAttacker, balooVonBruinwaldXiii),
      ).toBeSuccessfulCommand();

      // Baloo (0 strength, 3 willpower) is banished by strong attacker (5 strength)
      expect(testEngine.asPlayerOne().getCardZone(balooVonBruinwaldXiii)).toBe("discard");

      // Resolve any pending triggered effects (player one is the controller of the triggered ability)
      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        for (let i = 0; i < bagCount; i++) {
          const effects = testEngine.asPlayerOne().getBagEffects();
          if (effects.length > 0) {
            testEngine.asPlayerOne().resolvePendingByCard(balooVonBruinwaldXiii);
          }
        }
      }

      // Player one should gain 2 lore from the triggered ability
      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 2);
    });

    it("does NOT gain lore when Baloo survives a challenge", () => {
      const weakAttacker = createMockCharacter({
        id: "baloo-test-weak-attacker",
        name: "Weak Attacker",
        cost: 1,
        strength: 1,
        willpower: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: balooVonBruinwaldXiii, exerted: true }],
          deck: 1,
        },
        {
          play: [weakAttacker],
          deck: 1,
        },
      );

      // Pass turn so player two can challenge
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(
        testEngine.asPlayerTwo().challenge(weakAttacker, balooVonBruinwaldXiii),
      ).toBeSuccessfulCommand();

      // Baloo (3 willpower) survives 1 damage
      expect(testEngine.asPlayerOne().getCardZone(balooVonBruinwaldXiii)).toBe("play");

      // No lore gained since Baloo was not banished
      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore);
    });
  });
});
