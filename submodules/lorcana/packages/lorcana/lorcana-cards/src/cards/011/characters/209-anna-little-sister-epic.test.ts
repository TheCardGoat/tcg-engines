import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { annaLittleSisterEpic } from "./209-anna-little-sister-epic";

const discardFodder = createMockCharacter({
  id: "anna-epic-test-discard-fodder",
  name: "Discard Fodder",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Anna - Little Sister (Epic)", () => {
  describe("UNEXPECTED DISCOVERY - When you play this character, you may put a card from chosen player's discard on the bottom of their deck", () => {
    it("should put a card from own discard on bottom of own deck when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: annaLittleSisterEpic.cost,
        hand: [annaLittleSisterEpic],
        discard: [discardFodder],
        deck: 10,
      });

      // Card starts in discard
      expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");

      // Play Anna
      expect(testEngine.asPlayerOne().playCard(annaLittleSisterEpic)).toBeSuccessfulCommand();

      // Accept the optional ability and choose the card from discard
      const fodderId = testEngine.findCardInstanceId(discardFodder, "discard", PLAYER_ONE);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(annaLittleSisterEpic, {
          resolveOptional: true,
          targets: [fodderId],
        }),
      ).toBeSuccessfulCommand();

      // Card should be moved to deck (bottom)
      expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("deck");
    });

    it("should put a card from opponent's discard on bottom of their deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: annaLittleSisterEpic.cost,
          hand: [annaLittleSisterEpic],
          deck: 10,
        },
        {
          discard: [discardFodder],
          deck: 10,
        },
      );

      // Card starts in opponent's discard
      expect(testEngine.asPlayerTwo().getCardZone(discardFodder)).toBe("discard");

      // Play Anna
      expect(testEngine.asPlayerOne().playCard(annaLittleSisterEpic)).toBeSuccessfulCommand();

      // Accept the optional ability and choose the card from opponent's discard
      const fodderId = testEngine.findCardInstanceId(discardFodder, "discard", PLAYER_TWO);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(annaLittleSisterEpic, {
          resolveOptional: true,
          targets: [fodderId],
        }),
      ).toBeSuccessfulCommand();

      // Card should be moved to opponent's deck (bottom)
      expect(testEngine.asPlayerTwo().getCardZone(discardFodder)).toBe("deck");
    });

    it("should be optional - can decline the ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: annaLittleSisterEpic.cost,
        hand: [annaLittleSisterEpic],
        discard: [discardFodder],
        deck: 10,
      });

      // Play Anna
      expect(testEngine.asPlayerOne().playCard(annaLittleSisterEpic)).toBeSuccessfulCommand();

      // Decline the optional ability
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(annaLittleSisterEpic, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Card should still be in discard
      expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");
    });
  });

  describe("Stats and basic properties", () => {
    it("should have correct stats", () => {
      expect(annaLittleSisterEpic.cost).toBe(2);
      expect(annaLittleSisterEpic.strength).toBe(2);
      expect(annaLittleSisterEpic.willpower).toBe(3);
      expect(annaLittleSisterEpic.lore).toBe(1);
    });

    it("should be inkable", () => {
      expect(annaLittleSisterEpic.inkable).toBe(true);
    });

    it("should have correct classifications", () => {
      expect(annaLittleSisterEpic.classifications).toEqual(["Storyborn", "Hero", "Queen"]);
    });

    it("should be amethyst ink", () => {
      expect(annaLittleSisterEpic.inkType).toEqual(["amethyst"]);
    });
  });
});
