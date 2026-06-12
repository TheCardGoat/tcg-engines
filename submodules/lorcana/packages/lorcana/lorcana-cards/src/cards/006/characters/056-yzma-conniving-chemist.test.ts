import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { yzmaConnivingChemist } from "./056-yzma-conniving-chemist";

const filler1 = createMockCharacter({ id: "yzma-cc-filler-1", name: "Filler 1", cost: 1 });
const filler2 = createMockCharacter({ id: "yzma-cc-filler-2", name: "Filler 2", cost: 1 });
const filler3 = createMockCharacter({ id: "yzma-cc-filler-3", name: "Filler 3", cost: 1 });

describe("Yzma - Conniving Chemist", () => {
  describe("FEEL THE POWER - {E} — If you have fewer than 3 cards in your hand, draw until you have 3 cards in your hand.", () => {
    it("draws up to 3 cards when hand is empty", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [yzmaConnivingChemist],
        hand: [],
        deck: [filler1, filler2, filler3],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(yzmaConnivingChemist, {
          ability: "FEEL THE POWER",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(3);
      expect(testEngine.asPlayerOne().isExerted(yzmaConnivingChemist)).toBe(true);
    });

    it("draws only enough to reach 3 when hand has fewer than 3 cards", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [yzmaConnivingChemist],
        hand: [filler1, filler2],
        deck: [filler3],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(yzmaConnivingChemist, {
          ability: "FEEL THE POWER",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(3);
    });

    it("cannot activate when hand already has 3 or more cards", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [yzmaConnivingChemist],
        hand: [filler1, filler2, filler3],
        deck: 3,
      });

      const result = testEngine.asPlayerOne().activateAbility(yzmaConnivingChemist, {
        ability: "FEEL THE POWER",
      });
      expect(result.success).toBe(false);
    });
  });
});
