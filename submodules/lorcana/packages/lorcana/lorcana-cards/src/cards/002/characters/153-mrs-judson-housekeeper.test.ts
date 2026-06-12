import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mrsJudsonHousekeeper } from "./153-mrs-judson-housekeeper";

const floodbornCharacter = createMockCharacter({
  id: "mrs-j-floodborn",
  name: "Floodborn Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  classifications: ["Floodborn", "Hero"],
});

const nonFloodbornCharacter = createMockCharacter({
  id: "mrs-j-non-floodborn",
  name: "Non-Floodborn Character",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  classifications: ["Storyborn", "Hero"],
});

const deckCard = createMockCharacter({
  id: "mrs-j-deck-card",
  name: "Top Of Deck Card",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
});

describe("Mrs. Judson - Housekeeper", () => {
  describe("TIDY UP — Whenever you play a Floodborn character, you may put the top card of your deck into your inkwell facedown and exerted.", () => {
    it("triggers when a Floodborn character is played and lets you put top of deck into inkwell", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mrsJudsonHousekeeper],
        hand: [floodbornCharacter],
        inkwell: floodbornCharacter.cost,
        deck: [deckCard],
      });

      expect(testEngine.asPlayerOne().playCard(floodbornCharacter)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mrsJudsonHousekeeper, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(deckCard)).toBe("inkwell");
      expect(testEngine.asPlayerOne().isExerted(deckCard)).toBe(true);
    });

    it("does not put a card into inkwell when the optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mrsJudsonHousekeeper],
        hand: [floodbornCharacter],
        inkwell: floodbornCharacter.cost,
        deck: [deckCard],
      });

      expect(testEngine.asPlayerOne().playCard(floodbornCharacter)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mrsJudsonHousekeeper, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(deckCard)).toBe("deck");
    });

    it("does not trigger when a non-Floodborn character is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mrsJudsonHousekeeper],
        hand: [nonFloodbornCharacter],
        inkwell: nonFloodbornCharacter.cost,
        deck: [deckCard],
      });

      expect(testEngine.asPlayerOne().playCard(nonFloodbornCharacter)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(deckCard)).toBe("deck");
    });

    it("places the deck card exerted in the inkwell and the deck is empty after", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mrsJudsonHousekeeper],
        hand: [floodbornCharacter],
        inkwell: floodbornCharacter.cost,
        deck: [deckCard],
      });

      expect(testEngine.asPlayerOne().playCard(floodbornCharacter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mrsJudsonHousekeeper, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(deckCard)).toBe("inkwell");
      expect(testEngine.asPlayerOne().isExerted(deckCard)).toBe(true);
      expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(0);
    });
  });
});
