import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { magicBroomIlluminaryKeeper } from "./048-magic-broom-illuminary-keeper";

const anotherCharacter = createMockCharacter({
  id: "test-another-character",
  name: "Another Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const deckCard = createMockCharacter({
  id: "test-deck-card",
  name: "Deck Card",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Magic Broom - Illuminary Keeper", () => {
  describe("NICE AND TIDY - Whenever you play another character, you may banish this character to draw a card.", () => {
    it("should trigger when playing another character and allow banishing to draw", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [anotherCharacter],
        inkwell: anotherCharacter.cost,
        play: [magicBroomIlluminaryKeeper],
        deck: [deckCard],
      });

      const initialHandCount = testEngine.asPlayerOne().getZonesCardCount("player_one").hand;
      const initialDeckCount = testEngine.asPlayerOne().getZonesCardCount("player_one").deck;

      expect(testEngine.asPlayerOne().playCard(anotherCharacter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(magicBroomIlluminaryKeeper, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(magicBroomIlluminaryKeeper)).toBe("discard");
      expect(testEngine.asPlayerOne().getZonesCardCount("player_one").hand).toBe(
        initialHandCount - 1 + 1,
      );
      expect(testEngine.asPlayerOne().getZonesCardCount("player_one").deck).toBe(
        initialDeckCount - 1,
      );
    });

    it("should be optional - player can decline to banish", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [anotherCharacter],
        inkwell: anotherCharacter.cost,
        play: [magicBroomIlluminaryKeeper],
        deck: [deckCard],
      });

      const initialDeckCount = testEngine.asPlayerOne().getZonesCardCount("player_one").deck;

      expect(testEngine.asPlayerOne().playCard(anotherCharacter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(magicBroomIlluminaryKeeper, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(magicBroomIlluminaryKeeper)).toBe("play");
      expect(testEngine.asPlayerOne().getZonesCardCount("player_one").deck).toBe(initialDeckCount);
    });

    it("should NOT trigger when playing Magic Broom itself", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [magicBroomIlluminaryKeeper],
        inkwell: magicBroomIlluminaryKeeper.cost,
        deck: [deckCard],
      });

      expect(testEngine.asPlayerOne().playCard(magicBroomIlluminaryKeeper)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("should NOT trigger when opponent plays a character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [magicBroomIlluminaryKeeper],
          deck: [deckCard],
        },
        {
          hand: [anotherCharacter],
          inkwell: anotherCharacter.cost,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().playCard(anotherCharacter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(magicBroomIlluminaryKeeper)).toBe("play");
    });
  });
});
