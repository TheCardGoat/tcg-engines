import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { bernardOverprepared } from "./169-bernard-over-prepared";

const allyCharacter = createMockCharacter({
  id: "bernard-test-ally",
  name: "Test Ally",
  cost: 1,
  strength: 1,
  willpower: 1,
  classifications: ["Storyborn", "Ally"],
});

const nonAllyCharacter = createMockCharacter({
  id: "bernard-test-non-ally",
  name: "Test Non-Ally",
  cost: 1,
  strength: 1,
  willpower: 1,
  classifications: ["Storyborn", "Hero"],
});

const deckCard1 = createMockCharacter({
  id: "bernard-deck-1",
  name: "Deck Card 1",
  cost: 1,
});
const deckCard2 = createMockCharacter({
  id: "bernard-deck-2",
  name: "Deck Card 2",
  cost: 1,
});
const deckCard3 = createMockCharacter({
  id: "bernard-deck-3",
  name: "Deck Card 3",
  cost: 1,
});

describe("Bernard - Over-Prepared", () => {
  describe("GO DOWN THERE AND INVESTIGATE — When you play this character, if you have an Ally character in play, you may draw a card.", () => {
    it("draws a card when you have an Ally character in play and accept", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [bernardOverprepared],
        play: [allyCharacter],
        deck: [deckCard1, deckCard2, deckCard3],
        inkwell: bernardOverprepared.cost,
      });

      expect(testEngine.asPlayerOne().playCard(bernardOverprepared)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(bernardOverprepared),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1, deck: 2 });
    });

    it("can decline drawing a card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [bernardOverprepared],
        play: [allyCharacter],
        deck: [deckCard1, deckCard2, deckCard3],
        inkwell: bernardOverprepared.cost,
      });

      expect(testEngine.asPlayerOne().playCard(bernardOverprepared)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(bernardOverprepared, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 0, deck: 3 });
    });

    it("does not trigger when no Ally character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [bernardOverprepared],
        play: [nonAllyCharacter],
        deck: [deckCard1, deckCard2, deckCard3],
        inkwell: bernardOverprepared.cost,
      });

      expect(testEngine.asPlayerOne().playCard(bernardOverprepared)).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 0, deck: 3 });
    });

    it("does not trigger when no characters are in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [bernardOverprepared],
        deck: [deckCard1, deckCard2, deckCard3],
        inkwell: bernardOverprepared.cost,
      });

      expect(testEngine.asPlayerOne().playCard(bernardOverprepared)).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 0, deck: 3 });
    });
  });
});
