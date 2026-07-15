import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { pascalRapunzelsCompanion } from "./053-pascal-rapunzels-companion";

const anotherCharacter = createMockCharacter({
  id: "pascal-test-companion",
  name: "Rapunzel",
  version: "Gifted with Healing",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Pascal - Rapunzel's Companion", () => {
  describe("CAMOUFLAGE - While you have another character in play, this character gains Evasive.", () => {
    it("does NOT have Evasive when alone in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [pascalRapunzelsCompanion],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().hasKeyword(pascalRapunzelsCompanion, "Evasive")).toBe(false);
    });

    it("gains Evasive when another character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [pascalRapunzelsCompanion, anotherCharacter],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().hasKeyword(pascalRapunzelsCompanion, "Evasive")).toBe(true);
    });

    it("regression: gains Evasive immediately when another character enters play", () => {
      const newCharacter = createMockCharacter({
        id: "pascal-new-arrival",
        name: "New Arrival",
        cost: 2,
        strength: 2,
        willpower: 2,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [pascalRapunzelsCompanion],
        hand: [newCharacter],
        inkwell: newCharacter.cost,
        deck: 5,
      });

      // Pascal alone — no Evasive
      expect(testEngine.asPlayerOne().hasKeyword(pascalRapunzelsCompanion, "Evasive")).toBe(false);

      // Play another character
      expect(testEngine.asPlayerOne().playCard(newCharacter)).toBeSuccessfulCommand();

      // Pascal should now have Evasive
      expect(testEngine.asPlayerOne().hasKeyword(pascalRapunzelsCompanion, "Evasive")).toBe(true);
    });
  });
});
