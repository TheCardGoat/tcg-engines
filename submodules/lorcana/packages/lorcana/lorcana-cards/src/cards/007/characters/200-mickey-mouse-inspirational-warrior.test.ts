import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mickeyMouseInspirationalWarrior } from "./200-mickey-mouse-inspirational-warrior";

const weakDefender = createMockCharacter({
  id: "mm-iw-defender",
  name: "Weak Defender",
  cost: 2,
  strength: 0,
  willpower: 1,
});

const freeCharacter = createMockCharacter({
  id: "mm-iw-free-char",
  name: "Free Character",
  cost: 5,
  strength: 3,
  willpower: 3,
});

describe("Mickey Mouse - Inspirational Warrior", () => {
  describe("STIRRING SPIRIT - During your turn, whenever this character banishes another character in a challenge, you may play a character for free.", () => {
    it("may play a character for free after banishing in a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mickeyMouseInspirationalWarrior, isDrying: false }],
          hand: [freeCharacter],
          inkwell: 0,
          deck: 3,
        },
        {
          play: [{ card: weakDefender, exerted: true, isDrying: false }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(mickeyMouseInspirationalWarrior, weakDefender),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(weakDefender)).toBe("discard");

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolveOnlyBag({ resolveOptional: true, targets: [freeCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(freeCharacter)).toBe("play");
    });

    it("regression: ability resolves even when Mickey is also banished in the same challenge", () => {
      // Mickey (1/1) challenges a 1/1 defender - both should be banished
      // Mickey's ability should still resolve even though Mickey died
      const strongDefender = createMockCharacter({
        id: "mm-iw-strong-defender",
        name: "Strong Defender",
        cost: 2,
        strength: 1,
        willpower: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mickeyMouseInspirationalWarrior, isDrying: false }],
          hand: [freeCharacter],
          inkwell: 0,
          deck: 3,
        },
        {
          play: [{ card: strongDefender, exerted: true, isDrying: false }],
          deck: 1,
        },
      );

      // Mickey (1/1) challenges strongDefender (1/1) - both should be banished
      expect(
        testEngine.asPlayerOne().challenge(mickeyMouseInspirationalWarrior, strongDefender),
      ).toBeSuccessfulCommand();

      // Both should be banished
      expect(testEngine.asPlayerTwo().getCardZone(strongDefender)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(mickeyMouseInspirationalWarrior)).toBe("discard");

      // Mickey's trigger should still fire even though he was also banished
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolveOnlyBag({ resolveOptional: true, targets: [freeCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(freeCharacter)).toBe("play");
    });
  });
});
