import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { annaLittleSister } from "./052-anna-little-sister";

const discardFodder = createMockCharacter({
  id: "anna-little-sister-discard-fodder",
  name: "Discard Fodder",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const actionFodder = createMockAction({
  id: "anna-little-sister-action-fodder",
  name: "Action Fodder",
  cost: 1,
});

describe("Anna - Little Sister", () => {
  describe("UNEXPECTED DISCOVERY - When you play this character, you may put a card from chosen player's discard on the bottom of their deck", () => {
    it("should put a card from own discard on bottom of own deck when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [annaLittleSister],
        inkwell: annaLittleSister.cost,
        discard: [discardFodder],
        deck: 10,
      });

      const discardId = testEngine.findCardInstanceId(discardFodder, "discard", PLAYER_ONE);
      expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");

      expect(testEngine.asPlayerOne().playCard(annaLittleSister)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(annaLittleSister, {
          resolveOptional: true,
          targets: [discardId],
        }),
      ).toBeSuccessfulCommand();

      // Card should be moved from discard to deck
      expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("deck");
    });

    it("should put a card from opponent's discard on bottom of their deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [annaLittleSister],
          inkwell: annaLittleSister.cost,
          deck: 10,
        },
        {
          discard: [discardFodder],
          deck: 10,
        },
      );

      const opponentDiscardId = testEngine.findCardInstanceId(discardFodder, "discard", PLAYER_TWO);
      expect(testEngine.asPlayerTwo().getCardZone(discardFodder)).toBe("discard");

      expect(testEngine.asPlayerOne().playCard(annaLittleSister)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(annaLittleSister, {
          resolveOptional: true,
          targets: [opponentDiscardId],
        }),
      ).toBeSuccessfulCommand();

      // Card should be moved from opponent's discard to opponent's deck
      expect(testEngine.asPlayerTwo().getCardZone(discardFodder)).toBe("deck");
    });

    it("should put a non-character card from discard on bottom of its owner's deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [annaLittleSister],
        inkwell: annaLittleSister.cost,
        discard: [actionFodder],
        deck: 10,
      });

      const actionId = testEngine.findCardInstanceId(actionFodder, "discard", PLAYER_ONE);

      expect(testEngine.asPlayerOne().playCard(annaLittleSister)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(annaLittleSister, {
          resolveOptional: true,
          targets: [actionId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(actionFodder)).toBe("deck");
    });

    it("should be optional - can decline the ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [annaLittleSister],
        inkwell: annaLittleSister.cost,
        discard: [discardFodder],
        deck: 10,
      });

      expect(testEngine.asPlayerOne().playCard(annaLittleSister)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(annaLittleSister, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // Card should still be in discard
      expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");
    });
  });

  describe("Stats and basic properties", () => {
    it("should have correct stats", () => {
      expect(annaLittleSister.cost).toBe(2);
      expect(annaLittleSister.strength).toBe(2);
      expect(annaLittleSister.willpower).toBe(3);
      expect(annaLittleSister.lore).toBe(1);
    });

    it("should be inkable", () => {
      expect(annaLittleSister.inkable).toBe(true);
    });

    it("should have correct classifications", () => {
      expect(annaLittleSister.classifications).toEqual(["Storyborn", "Hero", "Queen"]);
    });

    it("should be amethyst ink", () => {
      expect(annaLittleSister.inkType).toEqual(["amethyst"]);
    });
  });
});
