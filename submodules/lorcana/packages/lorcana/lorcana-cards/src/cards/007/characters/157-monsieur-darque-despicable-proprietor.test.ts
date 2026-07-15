import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { monsieurDarqueDespicableProprietor } from "./157-monsieur-darque-despicable-proprietor";

const allyItem = createMockItem({
  id: "darque-dp-test-item",
  name: "Test Item",
  cost: 2,
});

const allyItem2 = createMockItem({
  id: "darque-dp-test-item-2",
  name: "Test Item Two",
  cost: 3,
});

describe("Monsieur D'Arque - Despicable Proprietor", () => {
  describe("I'VE COME TO COLLECT — Whenever this character quests, you may banish chosen item of yours to draw a card.", () => {
    it("banishes chosen item and draws a card when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: monsieurDarqueDespicableProprietor, isDrying: false }, allyItem],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      const handBefore = testEngine.asPlayerOne().getZonesCardCount().hand;
      const deckBefore = testEngine.asPlayerOne().getZonesCardCount().deck;

      expect(
        testEngine.asPlayerOne().quest(monsieurDarqueDespicableProprietor),
      ).toBeSuccessfulCommand();

      // Optional triggered ability should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept the optional ability and target the item
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(monsieurDarqueDespicableProprietor, {
          resolveOptional: true,
          targets: [allyItem],
        }),
      ).toBeSuccessfulCommand();

      // Item should now be banished (in discard)
      expect(testEngine.asPlayerOne().getCardZone(allyItem)).toBe("discard");

      // Should have drawn 1 card
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(handBefore + 1);
      expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(deckBefore - 1);
    });

    it("is optional — can decline banishing item", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: monsieurDarqueDespicableProprietor, isDrying: false }, allyItem],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      const handBefore = testEngine.asPlayerOne().getZonesCardCount().hand;

      expect(
        testEngine.asPlayerOne().quest(monsieurDarqueDespicableProprietor),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(monsieurDarqueDespicableProprietor, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Item should still be in play
      expect(testEngine.asPlayerOne().getCardZone(allyItem)).toBe("play");

      // No card should have been drawn
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(handBefore);
    });

    it("still queues the trigger when no legal item can be chosen", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: monsieurDarqueDespicableProprietor, isDrying: false }],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().quest(monsieurDarqueDespicableProprietor),
      ).toBeSuccessfulCommand();

      // The trigger still goes to the bag. With no legal item to banish,
      // declining it leaves the game state unchanged.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(monsieurDarqueDespicableProprietor, { resolveOptional: false }),
      ).toBeSuccessfulCommand();
    });

    it("triggers on every quest, not just the first", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: monsieurDarqueDespicableProprietor, isDrying: false },
            allyItem,
            allyItem2,
          ],
          deck: 10,
        },
        {
          deck: 5,
        },
      );

      // First quest
      expect(
        testEngine.asPlayerOne().quest(monsieurDarqueDespicableProprietor),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(monsieurDarqueDespicableProprietor, {
          resolveOptional: true,
          targets: [allyItem],
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(allyItem)).toBe("discard");

      // Pass turns to reset exerted state
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Second quest (Monsieur D'Arque readied at start of turn)
      expect(
        testEngine.asPlayerOne().quest(monsieurDarqueDespicableProprietor),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(monsieurDarqueDespicableProprietor, {
          resolveOptional: true,
          targets: [allyItem2],
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(allyItem2)).toBe("discard");
    });
  });
});
