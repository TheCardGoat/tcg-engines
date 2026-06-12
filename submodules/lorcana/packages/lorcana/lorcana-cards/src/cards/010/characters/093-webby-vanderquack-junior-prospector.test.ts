import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { webbyVanderquackJuniorProspector } from "./093-webby-vanderquack-junior-prospector";

const deckCard = createMockCharacter({
  id: "webby-deck-filler",
  name: "Deck Filler",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Webby Vanderquack - Junior Prospector", () => {
  describe("Basic properties", () => {
    it("has Shift keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [webbyVanderquackJuniorProspector],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().hasKeyword(webbyVanderquackJuniorProspector, "Shift")).toBe(
        true,
      );
    });

    it("has Ward keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [webbyVanderquackJuniorProspector],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().hasKeyword(webbyVanderquackJuniorProspector, "Ward")).toBe(
        true,
      );
    });
  });

  describe("WORK SMARTER - Whenever this character quests, if an opponent has more cards in their inkwell than you, you may put the top card of your deck into your inkwell facedown and exerted", () => {
    it("triggers when this character quests and opponent has more inkwell cards", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: webbyVanderquackJuniorProspector, isDrying: false }],
          inkwell: 3,
          deck: [deckCard, deckCard, deckCard],
        },
        {
          inkwell: 6,
          deck: 3,
        },
      );

      expect(
        testEngine.asPlayerOne().quest(webbyVanderquackJuniorProspector),
      ).toBeSuccessfulCommand();

      // The optional ability should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

      // Accept the optional ability
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(webbyVanderquackJuniorProspector, {}),
      ).toBeSuccessfulCommand();

      // The inkwell should have grown by 1 (the top card of deck moved there)
      expect(testEngine.asPlayerOne().getZonesCardCount().inkwell).toBe(4);
    });

    it("does not trigger when player has equal inkwell cards to opponent", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: webbyVanderquackJuniorProspector, isDrying: false }],
          inkwell: 3,
          deck: [deckCard, deckCard, deckCard],
        },
        {
          inkwell: 3,
          deck: 3,
        },
      );

      expect(
        testEngine.asPlayerOne().quest(webbyVanderquackJuniorProspector),
      ).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      // Condition failed (equal inkwell), so inkwell stays the same
      expect(testEngine.asPlayerOne().getZonesCardCount().inkwell).toBe(3);
    });

    it("does not trigger when player has more inkwell cards than opponent", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: webbyVanderquackJuniorProspector, isDrying: false }],
          inkwell: 6,
          deck: [deckCard, deckCard, deckCard],
        },
        {
          inkwell: 3,
          deck: 3,
        },
      );

      expect(
        testEngine.asPlayerOne().quest(webbyVanderquackJuniorProspector),
      ).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      // Condition failed (player has more inkwell), so inkwell stays the same
      expect(testEngine.asPlayerOne().getZonesCardCount().inkwell).toBe(6);
    });

    it("puts top card of deck into inkwell facedown and exerted when ability resolves", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: webbyVanderquackJuniorProspector, isDrying: false }],
          inkwell: 3,
          deck: [deckCard, deckCard, deckCard],
        },
        {
          inkwell: 6,
          deck: 3,
        },
      );

      const inkwellBefore = testEngine.asPlayerOne().getZonesCardCount().inkwell;

      expect(
        testEngine.asPlayerOne().quest(webbyVanderquackJuniorProspector),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(webbyVanderquackJuniorProspector, {}),
      ).toBeSuccessfulCommand();

      // Inkwell gained 1 card
      expect(testEngine.asPlayerOne().getZonesCardCount().inkwell).toBe(inkwellBefore + 1);
    });
  });
});
