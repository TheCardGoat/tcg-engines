import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { aurelianGyrosensor } from "./163-aurelian-gyrosensor";

const questingCharacter = createMockCharacter({
  id: "aurelian-gyrosensor-questing-char",
  name: "Questing Character",
  cost: 2,
  lore: 1,
});

const topDeckCard = createMockCharacter({
  id: "aurelian-gyrosensor-top-deck-card",
  name: "Top Deck Card",
  cost: 1,
});

describe("Aurelian Gyrosensor", () => {
  describe("SEEKING KNOWLEDGE — Whenever one of your characters quests, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.", () => {
    it("triggers a scry 1 when a character quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        deck: 2,
        play: [aurelianGyrosensor, { card: questingCharacter, isDrying: false }],
      });

      expect(testEngine.asPlayerOne().quest(questingCharacter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("does not trigger when opponent's character quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [aurelianGyrosensor], deck: 2 },
        { play: [{ card: questingCharacter, isDrying: false }] },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().quest(questingCharacter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("returns the card to the top of the deck when chosen", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        deck: [topDeckCard],
        play: [aurelianGyrosensor, { card: questingCharacter, isDrying: false }],
      });

      expect(testEngine.asPlayerOne().quest(questingCharacter)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      // Resolve the bag to activate the optional scry
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(aurelianGyrosensor),
      ).toBeSuccessfulCommand();

      // Provide scry destination: put topDeckCard back on top
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [
            { zone: "deck-top", cards: [topDeckCard] },
            { zone: "deck-bottom", cards: [] },
          ],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ deck: 1 });
      expect(testEngine.asPlayerOne().getCardZone(topDeckCard)).toBe("deck");
    });

    it("does not scry when the optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        deck: 2,
        play: [aurelianGyrosensor, { card: questingCharacter, isDrying: false }],
      });

      expect(testEngine.asPlayerOne().quest(questingCharacter)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(aurelianGyrosensor, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ deck: 2 });
    });
  });
});
