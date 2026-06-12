import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { princeAchmedRivalSuitor } from "./184-prince-achmed-rival-suitor";
import { charlotteLaBouffMardiGrasPrincess } from "./008-charlotte-la-bouff-mardi-gras-princess";

const nonPrincessCharacter = createMockCharacter({
  id: "prince-achmed-rs-non-princess",
  name: "Non Princess Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  classifications: ["Storyborn", "Hero"],
});

describe("Prince Achmed - Rival Suitor", () => {
  describe("UNWELCOME PROPOSAL — When you play this character, you may exert chosen Princess character.", () => {
    it("can exert a Princess character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [princeAchmedRivalSuitor],
          inkwell: princeAchmedRivalSuitor.cost,
          deck: 2,
        },
        {
          play: [charlotteLaBouffMardiGrasPrincess],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(princeAchmedRivalSuitor)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(princeAchmedRivalSuitor, {
          resolveOptional: true,
          targets: [charlotteLaBouffMardiGrasPrincess],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().isExerted(charlotteLaBouffMardiGrasPrincess)).toBe(true);
    });

    it("cannot target a non-Princess character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [princeAchmedRivalSuitor],
          inkwell: princeAchmedRivalSuitor.cost,
          deck: 2,
        },
        {
          play: [charlotteLaBouffMardiGrasPrincess, nonPrincessCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(princeAchmedRivalSuitor)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const result = testEngine.asPlayerOne().resolvePendingByCard(princeAchmedRivalSuitor, {
        resolveOptional: true,
        targets: [nonPrincessCharacter],
      });

      expect(result.success).toBe(false);
      expect(testEngine.asPlayerTwo().isExerted(nonPrincessCharacter)).toBe(false);
    });

    it("is optional — player can choose not to exert a Princess", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [princeAchmedRivalSuitor],
          inkwell: princeAchmedRivalSuitor.cost,
          deck: 2,
        },
        {
          play: [charlotteLaBouffMardiGrasPrincess],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(princeAchmedRivalSuitor)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(princeAchmedRivalSuitor, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().isExerted(charlotteLaBouffMardiGrasPrincess)).toBe(false);
    });
  });
});
