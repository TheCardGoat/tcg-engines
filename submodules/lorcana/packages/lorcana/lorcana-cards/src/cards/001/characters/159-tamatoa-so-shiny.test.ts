import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockItem } from "@tcg/lorcana-engine/testing";
import { tamatoaSoShiny } from "./159-tamatoa-so-shiny";

const itemA = createMockItem({
  id: "tamatoa-test-item-a",
  name: "Test Item A",
  cost: 1,
});

const itemB = createMockItem({
  id: "tamatoa-test-item-b",
  name: "Test Item B",
  cost: 1,
});

describe("Tamatoa - So Shiny!", () => {
  describe("GLAM - This character gets +1 {L} for each item you have in play.", () => {
    it("has base lore of 1 with no items in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [tamatoaSoShiny],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardLore(tamatoaSoShiny)).toBe(1);
    });

    it("gets +1 lore for each item in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [tamatoaSoShiny],
        hand: [itemA, itemB],
        inkwell: itemA.cost + itemB.cost,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardLore(tamatoaSoShiny)).toBe(1);

      expect(testEngine.asPlayerOne().playCard(itemA)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardLore(tamatoaSoShiny)).toBe(2);

      expect(testEngine.asPlayerOne().playCard(itemB)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardLore(tamatoaSoShiny)).toBe(3);
    });
  });

  describe("WHAT HAVE WE HERE? - When you play this character and whenever he quests, you may return an item card from your discard to your hand.", () => {
    it("triggers on play and can return an item from discard to hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [tamatoaSoShiny],
        discard: [{ card: itemA }],
        inkwell: tamatoaSoShiny.cost,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(tamatoaSoShiny)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(tamatoaSoShiny, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      const pendingChoice = testEngine.asPlayerOne().getPendingChoice();
      if (pendingChoice) {
        const itemAId = testEngine.findCardInstanceId(itemA, "discard");
        expect(
          testEngine.asPlayerOne().resolveNextPending({ targets: [itemAId] }),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerOne().getCardZone(itemA)).toBe("hand");
    });

    it("can decline the optional ability on play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [tamatoaSoShiny],
        discard: [{ card: itemA }],
        inkwell: tamatoaSoShiny.cost,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(tamatoaSoShiny)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(tamatoaSoShiny, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(itemA)).toBe("discard");
    });

    it("triggers on quest and can return an item from discard to hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: tamatoaSoShiny }],
        discard: [{ card: itemB }],
        deck: 5,
      });

      // Pass turns to dry Tamatoa before questing
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().quest(tamatoaSoShiny)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(tamatoaSoShiny, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      const pendingChoice = testEngine.asPlayerOne().getPendingChoice();
      if (pendingChoice) {
        const itemBId = testEngine.findCardInstanceId(itemB, "discard");
        expect(
          testEngine.asPlayerOne().resolveNextPending({ targets: [itemBId] }),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerOne().getCardZone(itemB)).toBe("hand");
    });

    it("does not trigger when no items are in the discard on play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [tamatoaSoShiny],
        discard: [],
        inkwell: tamatoaSoShiny.cost,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(tamatoaSoShiny)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
