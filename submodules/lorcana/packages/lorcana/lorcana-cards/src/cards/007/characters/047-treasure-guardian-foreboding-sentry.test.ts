import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { treasureGuardianForebodingSentry } from "./047-treasure-guardian-foreboding-sentry";

const illusionCharacter = createMockCharacter({
  id: "treasure-guardian-illusion-char",
  name: "Illusion Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Illusion"],
});

const nonIllusionCharacter = createMockCharacter({
  id: "treasure-guardian-non-illusion-char",
  name: "Non-Illusion Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn"],
});

const deckCard = createMockCharacter({
  id: "treasure-guardian-deck-card",
  name: "Deck Card",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Treasure Guardian - Foreboding Sentry", () => {
  describe("UNTOLD TREASURE - When you play this character, if you have an Illusion character in play, you may draw a card.", () => {
    it("draws a card when an Illusion character is in play and player accepts optional", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [treasureGuardianForebodingSentry],
        play: [illusionCharacter],
        inkwell: treasureGuardianForebodingSentry.cost,
        deck: [deckCard],
      });

      const handBefore = testEngine.asPlayerOne().getZonesCardCount().hand;
      expect(handBefore).toBe(1);

      expect(
        testEngine.asPlayerOne().playCard(treasureGuardianForebodingSentry),
      ).toBeSuccessfulCommand();

      // Bag should have 1 optional effect (the draw)
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(treasureGuardianForebodingSentry, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Hand should now have 1 card (deckCard was drawn)
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    });

    it("does not draw a card when optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [treasureGuardianForebodingSentry],
        play: [illusionCharacter],
        inkwell: treasureGuardianForebodingSentry.cost,
        deck: [deckCard],
      });

      expect(
        testEngine.asPlayerOne().playCard(treasureGuardianForebodingSentry),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(treasureGuardianForebodingSentry, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Hand should be empty (no draw happened)
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
    });

    it("resolves with no effect when no Illusion character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [treasureGuardianForebodingSentry],
        play: [nonIllusionCharacter],
        inkwell: treasureGuardianForebodingSentry.cost,
        deck: [deckCard],
      });

      expect(
        testEngine.asPlayerOne().playCard(treasureGuardianForebodingSentry),
      ).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
    });
  });
});
