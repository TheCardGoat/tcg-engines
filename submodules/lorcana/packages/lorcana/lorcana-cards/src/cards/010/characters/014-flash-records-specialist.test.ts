import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { flashRecordsSpecialist } from "./014-flash-records-specialist";

const detectiveCharacter = createMockCharacter({
  id: "mock-detective",
  name: "Mock Detective",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  classifications: ["Detective"],
});

const nonDetectiveCharacter = createMockCharacter({
  id: "mock-non-detective",
  name: "Mock Non-Detective",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Flash - Records Specialist", () => {
  describe("HOLD... YOUR HORSES - This character enters play exerted", () => {
    it("enters play exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [flashRecordsSpecialist],
        inkwell: flashRecordsSpecialist.cost,
      });

      expect(testEngine.asPlayerOne().playCard(flashRecordsSpecialist)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(flashRecordsSpecialist)).toBe(true);
    });
  });

  describe("DEEP RESEARCH - Whenever this character quests, you may give chosen Detective character +2 {S} this turn", () => {
    it("gives chosen Detective character +2 strength this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: flashRecordsSpecialist, isDrying: false }, detectiveCharacter],
        deck: 3,
      });

      const originalStrength = testEngine.asPlayerOne().getCardStrength(detectiveCharacter);

      expect(testEngine.asPlayerOne().quest(flashRecordsSpecialist)).toBeSuccessfulCommand();

      // Accept optional and target the detective
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(flashRecordsSpecialist, { targets: [detectiveCharacter] }),
      ).toBeSuccessfulCommand();

      // Detective should have +2 strength this turn
      expect(testEngine.asPlayerOne().getCardStrength(detectiveCharacter)).toBe(
        originalStrength + 2,
      );
    });

    it("is optional - can decline to give strength", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: flashRecordsSpecialist, isDrying: false }, detectiveCharacter],
        deck: 3,
      });

      const originalStrength = testEngine.asPlayerOne().getCardStrength(detectiveCharacter);

      expect(testEngine.asPlayerOne().quest(flashRecordsSpecialist)).toBeSuccessfulCommand();

      // Decline the optional ability
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(flashRecordsSpecialist, { resolveOptional: false });

      // Detective should still have original strength
      expect(testEngine.asPlayerOne().getCardStrength(detectiveCharacter)).toBe(originalStrength);
    });

    it("can only target Detective characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: flashRecordsSpecialist, isDrying: false },
          detectiveCharacter,
          nonDetectiveCharacter,
        ],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().quest(flashRecordsSpecialist)).toBeSuccessfulCommand();

      // Attempting to target non-detective should fail
      const result = testEngine
        .asPlayerOne()
        .resolvePendingByCard(flashRecordsSpecialist, { targets: [nonDetectiveCharacter] });
      expect(result.success).toBe(false);
    });
  });
});
