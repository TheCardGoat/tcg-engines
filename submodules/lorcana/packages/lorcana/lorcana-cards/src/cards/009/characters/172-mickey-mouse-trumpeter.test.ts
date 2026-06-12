import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrumpeter } from "./172-mickey-mouse-trumpeter";

const characterToPlay = createMockCharacter({
  id: "trumpeter-target-char",
  name: "Character To Play",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Mickey Mouse - Trumpeter", () => {
  describe("SOUND THE CALL - {E}, 2 {I} - Play a character for free.", () => {
    it("activates ability to play a character for free from hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mickeyMouseTrumpeter, isDrying: false }],
          hand: [characterToPlay],
          inkwell: mickeyMouseTrumpeter.cost + 2,
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(mickeyMouseTrumpeter, {
          targets: [characterToPlay],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(characterToPlay)).toBe("play");
      expect(testEngine.asPlayerOne().isExerted(mickeyMouseTrumpeter)).toBe(true);
    });

    it("plays a character for free without spending additional ink for the character cost", () => {
      const expensiveCharacter = createMockCharacter({
        id: "trumpeter-expensive-char",
        name: "Expensive Character",
        cost: 8,
        strength: 3,
        willpower: 3,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mickeyMouseTrumpeter, isDrying: false }],
          hand: [expensiveCharacter],
          inkwell: mickeyMouseTrumpeter.cost + 2,
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(mickeyMouseTrumpeter, {
          targets: [expensiveCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(expensiveCharacter)).toBe("play");
    });
  });
});
