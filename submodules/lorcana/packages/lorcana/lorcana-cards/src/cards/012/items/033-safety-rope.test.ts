import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { safetyRope } from "./033-safety-rope";

const discardCharacter = createMockCharacter({
  id: "safety-rope-discard-character",
  name: "Discarded Hero",
  cost: 3,
  strength: 2,
  willpower: 3,
});

const discardAction = createMockAction({
  id: "safety-rope-discard-action",
  name: "Discarded Action",
  cost: 2,
});

const drawnCard = createMockCharacter({
  id: "safety-rope-drawn-card",
  name: "Drawn Card",
  cost: 1,
});

describe("Safety Rope", () => {
  describe("GRAB HOLD! - When you play this item, you may put a character card from your discard on the top of your deck.", () => {
    it("puts a chosen character card from discard on top of deck when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: safetyRope.cost,
        hand: [safetyRope],
        discard: [discardCharacter],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().playCard(safetyRope)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(safetyRope, { resolveOptional: true, targets: [discardCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(discardCharacter)).toBe("deck");
    });

    it("can decline the optional ability leaving the character in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: safetyRope.cost,
        hand: [safetyRope],
        discard: [discardCharacter],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().playCard(safetyRope)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(safetyRope, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(discardCharacter)).toBe("discard");
    });

    it("does not move a non-character card from discard to top of deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: safetyRope.cost,
        hand: [safetyRope],
        discard: [discardAction],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().playCard(safetyRope)).toBeSuccessfulCommand();
      // Even if the trigger is enqueued, resolving it with no valid character
      // leaves the action in discard.
      testEngine.asPlayerOne().resolvePendingByCard(safetyRope, { resolveOptional: true });

      expect(testEngine.asPlayerOne().getCardZone(discardAction)).toBe("discard");
    });
  });

  describe("PACK IT UP - At the end of your turn, you may banish this item to draw a card.", () => {
    it("banishes the item and draws a card when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [safetyRope],
        deck: [drawnCard],
      });

      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(safetyRope, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(safetyRope)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    });

    it("can decline the optional ability keeping the item in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [safetyRope],
        deck: [drawnCard],
      });

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(safetyRope, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(safetyRope)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
    });
  });
});
