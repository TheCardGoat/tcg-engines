import { describe, expect, it } from "bun:test";
import type { ZoneId } from "@tcg/lorcana-engine";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { miloThatchGettingHisHandsDirty } from "./082-milo-thatch-getting-his-hands-dirty";

const handFodder = createMockCharacter({
  id: "milo-hand-fodder",
  name: "Hand Fodder",
  cost: 1,
});

const fodderA = createMockCharacter({
  id: "milo-fodder-a",
  name: "Fodder A",
  cost: 1,
});

const fodderB = createMockCharacter({
  id: "milo-fodder-b",
  name: "Fodder B",
  cost: 1,
});

const targetCharacter = createMockCharacter({
  id: "milo-target-character",
  name: "Target Character",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Milo Thatch - Getting His Hands Dirty", () => {
  describe("SCHOLAR'S GAMBIT - When you play this character, you may choose and discard a card to return chosen character to their player's hand.", () => {
    it("discards a card and returns opponent's chosen character to their hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [miloThatchGettingHisHandsDirty, handFodder],
          inkwell: miloThatchGettingHisHandsDirty.cost,
          deck: 5,
        },
        {
          play: [targetCharacter],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(miloThatchGettingHisHandsDirty),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(miloThatchGettingHisHandsDirty, {
          resolveOptional: true,
          targets: [handFodder, targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(handFodder)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardZone(targetCharacter)).toBe("hand");
    });

    it("is optional - nothing happens when declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [miloThatchGettingHisHandsDirty, handFodder],
          inkwell: miloThatchGettingHisHandsDirty.cost,
          deck: 5,
        },
        {
          play: [targetCharacter],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(miloThatchGettingHisHandsDirty),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(miloThatchGettingHisHandsDirty, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(handFodder)).toBe("hand");
      expect(testEngine.asPlayerTwo().getCardZone(targetCharacter)).toBe("play");
    });
  });

  describe("PRACTICAL KNOWLEDGE - At the end of your turn, if 2 or more cards were put into your discard this turn, draw a card.", () => {
    it("draws a card at end of turn when 2+ cards entered your discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [miloThatchGettingHisHandsDirty],
          hand: [fodderA, fodderB],
          deck: 3,
        },
        {
          deck: 3,
        },
      );

      const handCountBefore = testEngine.asPlayerOne().getZonesCardCount().hand;

      const fodderAId = testEngine.findCardInstanceId(fodderA, "hand", PLAYER_ONE);
      const fodderBId = testEngine.findCardInstanceId(fodderB, "hand", PLAYER_ONE);
      expect(
        testEngine.asServer().manualMoveCard(fodderAId, `discard:${PLAYER_ONE}` as ZoneId),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asServer().manualMoveCard(fodderBId, `discard:${PLAYER_ONE}` as ZoneId),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(miloThatchGettingHisHandsDirty),
        ).toBeSuccessfulCommand();
      }

      // Hand started at handCountBefore, 2 were moved to discard (-2), then draw (+1)
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(handCountBefore - 2 + 1);
      expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(2);
    });

    it("does not draw a card when fewer than 2 cards entered your discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [miloThatchGettingHisHandsDirty],
          hand: [fodderA],
          deck: 3,
        },
        {
          deck: 3,
        },
      );

      const fodderAId = testEngine.findCardInstanceId(fodderA, "hand", PLAYER_ONE);
      expect(
        testEngine.asServer().manualMoveCard(fodderAId, `discard:${PLAYER_ONE}` as ZoneId),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Condition not met - deck should still be 3
      expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(3);
    });

    it("does not draw when no cards entered your discard this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [miloThatchGettingHisHandsDirty],
          deck: 3,
        },
        {
          deck: 3,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(3);
    });
  });

  describe("Ward", () => {
    it("exposes Ward through the runtime card model", () => {
      const testEngine = new LorcanaTestEngine({
        play: [miloThatchGettingHisHandsDirty],
      });

      expect(miloThatchGettingHisHandsDirty.missingImplementation).toBeUndefined();
      expect(miloThatchGettingHisHandsDirty.missingTests).toBeUndefined();
      expect(testEngine.getCardModel(miloThatchGettingHisHandsDirty).hasWard()).toBe(true);
    });
  });
});
