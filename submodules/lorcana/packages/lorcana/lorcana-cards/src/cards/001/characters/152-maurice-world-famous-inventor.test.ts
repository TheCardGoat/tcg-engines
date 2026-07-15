import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockItem,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { mauriceWorldfamousInventor } from "./152-maurice-world-famous-inventor";

const testItem = createMockItem({
  id: "maurice-test-item",
  name: "Test Item",
  cost: 4,
});

const testCharacter = createMockCharacter({
  id: "maurice-test-character",
  name: "Test Character",
  cost: 4,
});

const drawnCard = createMockCharacter({
  id: "maurice-drawn-card",
  name: "Drawn Card",
  cost: 1,
});

describe("Maurice - World-Famous Inventor", () => {
  describe("GIVE IT A TRY - Whenever this character quests, you pay 2 less for the next item you play this turn", () => {
    it("reduces cost by 2 for the next item after questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: testItem.cost - 2,
        play: [{ card: mauriceWorldfamousInventor }],
        hand: [testItem],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().canPlayCard(testItem)).toBe(false);

      expect(testEngine.asPlayerOne().quest(mauriceWorldfamousInventor)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().canPlayCard(testItem)).toBe(true);
      expect(testEngine.asPlayerOne().playCard(testItem)).toBeSuccessfulCommand();
    });

    it("only reduces cost for items, not characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: testCharacter.cost - 2,
        play: [{ card: mauriceWorldfamousInventor }],
        hand: [testCharacter],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().quest(mauriceWorldfamousInventor)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().canPlayCard(testCharacter)).toBe(false);
    });

    it("only reduces cost for the NEXT item, not subsequent ones", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: testItem.cost * 2 - 2,
        play: [{ card: mauriceWorldfamousInventor }],
        hand: [testItem, testItem],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().quest(mauriceWorldfamousInventor)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(testItem)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().canPlayCard(testItem)).toBe(false);
    });
  });

  describe("IT WORKS! - Whenever you play an item, you may draw a card", () => {
    it("puts a draw-card effect in the bag when you play an item", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: testItem.cost,
        play: [{ card: mauriceWorldfamousInventor }],
        hand: [testItem],
        deck: [drawnCard],
      });

      expect(testEngine.asPlayerOne().playCard(testItem)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("draws a card when the optional is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: testItem.cost,
        play: [{ card: mauriceWorldfamousInventor }],
        hand: [testItem],
        deck: [drawnCard],
      });

      expect(testEngine.asPlayerOne().playCard(testItem)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(mauriceWorldfamousInventor),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1, deck: 0, play: 2 });
    });

    it("does not draw a card when the optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: testItem.cost,
        play: [{ card: mauriceWorldfamousInventor }],
        hand: [testItem],
        deck: [drawnCard],
      });

      expect(testEngine.asPlayerOne().playCard(testItem)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mauriceWorldfamousInventor, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 0, deck: 1, play: 2 });
    });

    it("does not trigger when opponent plays an item", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: testItem.cost,
          hand: [testItem],
          deck: [drawnCard],
        },
        {
          play: [{ card: mauriceWorldfamousInventor }],
        },
      );

      expect(testEngine.asPlayerOne().playCard(testItem)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 0, deck: 1, play: 1 });
    });
  });
});
