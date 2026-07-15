import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { scroogeMcduckResourcefulMiser } from "./154-scrooge-mcduck-resourceful-miser";

const matchingItem = createMockItem({
  id: "matching-item",
  name: "Matching Item",
  cost: 2,
});

const nonMatchA = createMockCharacter({
  id: "non-match-a",
  name: "Non Match A",
  cost: 1,
});

const nonMatchB = createMockCharacter({
  id: "non-match-b",
  name: "Non Match B",
  cost: 3,
});

const nonMatchC = createMockCharacter({
  id: "non-match-c",
  name: "Non Match C",
  cost: 4,
});

const item1 = createMockItem({
  id: "item-1",
  name: "Item 1",
  cost: 1,
});

const item2 = createMockItem({
  id: "item-2",
  name: "Item 2",
  cost: 1,
});

const item3 = createMockItem({
  id: "item-3",
  name: "Item 3",
  cost: 1,
});

const item4 = createMockItem({
  id: "item-4",
  name: "Item 4",
  cost: 1,
});

describe("Scrooge McDuck - Resourceful Miser", () => {
  describe("FORTUNE HUNTER - When you play this character, look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.", () => {
    it("reveals an item card to hand, puts rest on bottom", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [scroogeMcduckResourcefulMiser],
        inkwell: scroogeMcduckResourcefulMiser.cost,
        deck: [nonMatchA, matchingItem, nonMatchB, nonMatchC],
      });

      expect(
        testEngine.asPlayerOne().playCard(scroogeMcduckResourcefulMiser),
      ).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(scroogeMcduckResourcefulMiser),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [
            { zone: "hand", cards: [matchingItem] },
            { zone: "deck-bottom", cards: [nonMatchC, nonMatchB, nonMatchA] },
          ],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(matchingItem)).toBe("hand");
    });
  });

  describe("PUT IT TO GOOD USE - You may exert 4 items of yours to play this character for free.", () => {
    it("can be played for free by exerting 4 ready items you control", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [scroogeMcduckResourcefulMiser],
        play: [item1, item2, item3, item4],
        inkwell: 0,
      });

      const exertTargets = [
        testEngine.findCardInstanceId(item1, "play"),
        testEngine.findCardInstanceId(item2, "play"),
        testEngine.findCardInstanceId(item3, "play"),
        testEngine.findCardInstanceId(item4, "play"),
      ];

      expect(
        testEngine.asPlayerOne().playCard(scroogeMcduckResourcefulMiser, {
          cost: { cost: "exert-items", exertTargets },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(item1).exerted).toBe(true);
      expect(testEngine.asPlayerOne().getCard(item2).exerted).toBe(true);
      expect(testEngine.asPlayerOne().getCard(item3).exerted).toBe(true);
      expect(testEngine.asPlayerOne().getCard(item4).exerted).toBe(true);
      expect(testEngine.asPlayerOne().getCard(scroogeMcduckResourcefulMiser).zone).toBe("play");
    });

    it("can still be played normally with ink", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [scroogeMcduckResourcefulMiser],
        inkwell: scroogeMcduckResourcefulMiser.cost,
      });

      expect(
        testEngine.asPlayerOne().playCard(scroogeMcduckResourcefulMiser),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(scroogeMcduckResourcefulMiser).zone).toBe("play");
    });

    it("cannot use exert cost with fewer than 4 items", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [scroogeMcduckResourcefulMiser],
        play: [item1, item2, item3],
        inkwell: 0,
      });

      const exertTargets = [
        testEngine.findCardInstanceId(item1, "play"),
        testEngine.findCardInstanceId(item2, "play"),
        testEngine.findCardInstanceId(item3, "play"),
      ];

      expect(
        testEngine.asPlayerOne().playCard(scroogeMcduckResourcefulMiser, {
          cost: { cost: "exert-items", exertTargets },
        }),
      ).not.toBeSuccessfulCommand();
    });

    it("cannot use exert cost with already exerted items", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [scroogeMcduckResourcefulMiser],
        play: [item1, item2, item3, item4],
        inkwell: 0,
      });

      testEngine.asServer().manualExertCard(item1);

      const exertTargets = [
        testEngine.findCardInstanceId(item1, "play"),
        testEngine.findCardInstanceId(item2, "play"),
        testEngine.findCardInstanceId(item3, "play"),
        testEngine.findCardInstanceId(item4, "play"),
      ];

      expect(
        testEngine.asPlayerOne().playCard(scroogeMcduckResourcefulMiser, {
          cost: { cost: "exert-items", exertTargets },
        }),
      ).not.toBeSuccessfulCommand();
    });

    it("appears in available moves when 4+ ready items are in play and ink is 0", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [scroogeMcduckResourcefulMiser],
        play: [item1, item2, item3, item4],
        inkwell: 0,
      });
      const scroogeId = testEngine.findCardInstanceId(scroogeMcduckResourcefulMiser, "hand");

      const availableMoves = testEngine.asPlayerOne().getAvailableMoves();
      const playCardMove = availableMoves.find((m) => m.moveId === "playCard");
      expect(playCardMove).toBeDefined();
      expect(playCardMove!.selectableCardIds).toContain(scroogeId);
    });

    it("does not appear in available moves when fewer than 4 ready items are in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [scroogeMcduckResourcefulMiser],
        play: [item1, item2, item3],
        inkwell: 0,
      });

      const availableMoves = testEngine.asPlayerOne().getAvailableMoves();
      const playCardMove = availableMoves.find((m) => m.moveId === "playCard");
      if (playCardMove) {
        const scroogeId = testEngine.findCardInstanceId(scroogeMcduckResourcefulMiser, "hand");
        expect(playCardMove.selectableCardIds).not.toContain(scroogeId);
      }
    });

    it("does not appear in available moves when items are exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [scroogeMcduckResourcefulMiser],
        play: [item1, item2, item3, item4],
        inkwell: 0,
      });

      testEngine.asServer().manualExertCard(item1);

      const availableMoves = testEngine.asPlayerOne().getAvailableMoves();
      const playCardMove = availableMoves.find((m) => m.moveId === "playCard");
      if (playCardMove) {
        const scroogeId = testEngine.findCardInstanceId(scroogeMcduckResourcefulMiser, "hand");
        expect(playCardMove.selectableCardIds).not.toContain(scroogeId);
      }
    });
  });
});
