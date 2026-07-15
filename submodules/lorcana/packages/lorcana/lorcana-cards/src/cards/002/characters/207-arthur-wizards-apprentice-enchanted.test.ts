import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { arthurWizardsApprenticeEnchanted } from "./207-arthur-wizards-apprentice-enchanted";
import { arthurWizardsApprentice } from "./035-arthur-wizards-apprentice";
import { runEnchantedParityCharacterTest } from "./test-helpers";

runEnchantedParityCharacterTest(arthurWizardsApprenticeEnchanted, arthurWizardsApprentice);

const friendlyTarget = createMockCharacter({
  id: "arthur-friendly-target",
  name: "Friendly Target",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Arthur - Wizard's Apprentice (Enchanted)", () => {
  describe("STUDENT - Whenever this character quests, you may return another chosen character of yours to your hand to gain 2 lore.", () => {
    it("may return another character to hand and gain 2 lore when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: arthurWizardsApprenticeEnchanted, isDrying: false },
          { card: friendlyTarget, isDrying: false },
        ],
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().quest(arthurWizardsApprenticeEnchanted),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(arthurWizardsApprenticeEnchanted),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          resolveOptional: true,
          targets: [friendlyTarget],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(friendlyTarget)).toBe("hand");
      // 1 lore from quest + 2 lore from ability
      expect(testEngine.asPlayerOne().getLore("player_one")).toBe(3);
    });

    it("does not gain 2 lore if you decline the optional return", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: arthurWizardsApprenticeEnchanted, isDrying: false },
          { card: friendlyTarget, isDrying: false },
        ],
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().quest(arthurWizardsApprenticeEnchanted),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(arthurWizardsApprenticeEnchanted, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(friendlyTarget)).toBe("play");
      // Only 1 lore from quest, no bonus
      expect(testEngine.asPlayerOne().getLore("player_one")).toBe(1);
    });

    it("does not gain lore when there is no other character to return", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: arthurWizardsApprenticeEnchanted, isDrying: false }],
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().quest(arthurWizardsApprenticeEnchanted),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(arthurWizardsApprenticeEnchanted),
      ).toBeSuccessfulCommand();

      // Only 1 lore from quest
      expect(testEngine.asPlayerOne().getLore("player_one")).toBe(1);
    });
  });
});
