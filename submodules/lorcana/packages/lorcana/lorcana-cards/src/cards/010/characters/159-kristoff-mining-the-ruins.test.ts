import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { kristoffMiningTheRuins } from "./159-kristoff-mining-the-ruins";

const deckFiller = createMockCharacter({
  id: "kristoff-mtr-deck-filler",
  name: "Deck Filler",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const deckCard = createMockCharacter({
  id: "kristoff-mtr-deck-card",
  name: "Deck Card",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Kristoff - Mining the Ruins", () => {
  describe("Boost 1", () => {
    it("has Boost keyword ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [kristoffMiningTheRuins],
      });

      expect(testEngine.hasKeyword(kristoffMiningTheRuins, "Boost")).toBe(true);
    });
  });

  describe("WORTH MINING - Whenever this character quests, if there's a card under him, put the top card of your deck into your inkwell facedown and exerted.", () => {
    it("puts the top card of your deck into your inkwell facedown and exerted when questing with a card under him", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: kristoffMiningTheRuins, cardsUnder: [deckFiller], isDrying: false }],
        deck: [deckCard],
      });

      const initialInkwellCount = testEngine.asPlayerOne().getZonesCardCount().inkwell;

      expect(testEngine.asPlayerOne().quest(kristoffMiningTheRuins)).toBeSuccessfulCommand();

      // Inkwell should have one more card
      expect(testEngine.asPlayerOne().getZonesCardCount().inkwell).toBe(initialInkwellCount + 1);

      // The card should be in the inkwell facedown and exerted
      const deckCardProjected = testEngine.getCard(deckCard);
      expect(deckCardProjected).toBeDefined();
      expect(testEngine.getCardPublicFaceState(deckCard, "inkwell")).toBe("faceDown");
      expect(deckCardProjected?.exerted).toBe(true);
    });

    it("does NOT put a card into inkwell when questing without a card under him", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: kristoffMiningTheRuins, isDrying: false }],
        deck: [deckCard],
      });

      const initialInkwellCount = testEngine.asPlayerOne().getZonesCardCount().inkwell;

      expect(testEngine.asPlayerOne().quest(kristoffMiningTheRuins)).toBeSuccessfulCommand();

      // Inkwell count should remain the same
      expect(testEngine.asPlayerOne().getZonesCardCount().inkwell).toBe(initialInkwellCount);
    });

    it("does nothing when deck is empty even if there's a card under him", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: kristoffMiningTheRuins, cardsUnder: [deckFiller], isDrying: false }],
        deck: 0,
      });

      const initialInkwellCount = testEngine.asPlayerOne().getZonesCardCount().inkwell;

      expect(testEngine.asPlayerOne().quest(kristoffMiningTheRuins)).toBeSuccessfulCommand();

      // Nothing changes since deck is empty
      expect(testEngine.asPlayerOne().getZonesCardCount().inkwell).toBe(initialInkwellCount);
    });
  });
});
