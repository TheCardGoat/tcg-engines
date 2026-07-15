import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { kaaHypnotizingPython } from "./021-kaa-hypnotizing-python";

const opposingCharacter = createMockCharacter({
  id: "kaa-opposing-character",
  name: "Opposing Character",
  cost: 3,
  strength: 4,
  willpower: 4,
  lore: 1,
});

describe("Kaa - Hypnotizing Python", () => {
  describe("LOOK ME IN THE EYE — Whenever this character quests, chosen opposing character gets -2 {S} and gains Reckless until the start of your next turn.", () => {
    it("chosen opposing character gets -2 strength and gains Reckless after Kaa quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: kaaHypnotizingPython, isDrying: false }],
          deck: 3,
        },
        {
          play: [opposingCharacter],
          deck: 3,
        },
      );

      expect(testEngine.asPlayerOne().getCardStrength(opposingCharacter)).toBe(4);
      expect(testEngine.hasKeyword(opposingCharacter, "Reckless")).toBe(false);

      expect(testEngine.asPlayerOne().quest(kaaHypnotizingPython)).toBeSuccessfulCommand();

      // Triggered ability should place a bag effect requiring a chosen opposing character
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      const targetId = testEngine.findCardInstanceId(opposingCharacter, "play", PLAYER_TWO);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(kaaHypnotizingPython, {
          targets: [targetId],
        }),
      ).toBeSuccessfulCommand();

      // Opposing character should now have -2 strength and Reckless
      expect(testEngine.asPlayerOne().getCardStrength(opposingCharacter)).toBe(2);
      expect(testEngine.hasKeyword(opposingCharacter, "Reckless")).toBe(true);
    });

    it("the -2 strength and Reckless persist until the start of the controller's next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: kaaHypnotizingPython, isDrying: false }],
          deck: 3,
        },
        {
          play: [opposingCharacter],
          deck: 3,
        },
      );

      expect(testEngine.asPlayerOne().quest(kaaHypnotizingPython)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      const targetId = testEngine.findCardInstanceId(opposingCharacter, "play", PLAYER_TWO);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(kaaHypnotizingPython, {
          targets: [targetId],
        }),
      ).toBeSuccessfulCommand();

      // Effects are active during player one's turn
      expect(testEngine.asPlayerOne().getCardStrength(opposingCharacter)).toBe(2);
      expect(testEngine.hasKeyword(opposingCharacter, "Reckless")).toBe(true);

      // Pass player one's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Effects should still be active during player two's turn
      expect(testEngine.asPlayerOne().getCardStrength(opposingCharacter)).toBe(2);
      expect(testEngine.hasKeyword(opposingCharacter, "Reckless")).toBe(true);

      // The opposing character has Reckless and must challenge. Kaa is exerted (quested),
      // so the opposing character must challenge Kaa to satisfy the Reckless requirement.
      expect(
        testEngine.asPlayerTwo().challenge(opposingCharacter, kaaHypnotizingPython),
      ).toBeSuccessfulCommand();

      // Effects are still active until the start of player one's next turn
      expect(testEngine.asPlayerOne().getCardStrength(opposingCharacter)).toBe(2);
      expect(testEngine.hasKeyword(opposingCharacter, "Reckless")).toBe(true);

      // Pass player two's turn (start of player one's next turn) - effects should expire
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(opposingCharacter)).toBe(4);
      expect(testEngine.hasKeyword(opposingCharacter, "Reckless")).toBe(false);
    });
  });
});
