import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { elsaExploringTheUnknown } from "./045-elsa-exploring-the-unknown";

const drawnCard = createMockCharacter({
  id: "elsa-drawn-card",
  name: "Drawn Card",
  cost: 1,
});

describe("Elsa - Exploring the Unknown", () => {
  describe("CLOSER LOOK - When you play this character, you may draw a card.", () => {
    it("draws a card when the optional ability is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [elsaExploringTheUnknown],
        inkwell: elsaExploringTheUnknown.cost,
        deck: [drawnCard],
      });

      expect(testEngine.asPlayerOne().playCard(elsaExploringTheUnknown)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(elsaExploringTheUnknown),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1, deck: 0 });
    });

    it("does not draw a card when the optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [elsaExploringTheUnknown],
        inkwell: elsaExploringTheUnknown.cost,
        deck: [drawnCard],
      });

      expect(testEngine.asPlayerOne().playCard(elsaExploringTheUnknown)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(elsaExploringTheUnknown, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 0, deck: 1 });
    });
  });
});
