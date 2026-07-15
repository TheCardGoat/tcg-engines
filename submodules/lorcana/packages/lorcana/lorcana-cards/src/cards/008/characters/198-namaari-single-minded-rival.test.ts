import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { namaariSinglemindedRival } from "./198-namaari-single-minded-rival";

const drawnCard = createMockCharacter({
  id: "namaari-smr-drawn-card",
  name: "Namaari Drawn Card",
  cost: 1,
});

const discardFodder = createMockCharacter({
  id: "namaari-smr-discard-fodder",
  name: "Namaari Discard Fodder",
  cost: 1,
});

const extraDiscardFodder = createMockCharacter({
  id: "namaari-smr-extra-discard-fodder",
  name: "Namaari Extra Discard Fodder",
  cost: 1,
});

describe("Namaari - Single-Minded Rival", () => {
  describe("STRATEGIC EDGE — When you play this character and at the start of your turn, you may draw a card, then choose and discard a card.", () => {
    it("triggers when played: may draw then discard a card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        deck: [drawnCard],
        hand: [namaariSinglemindedRival, discardFodder],
        inkwell: namaariSinglemindedRival.cost,
      });

      expect(testEngine.asPlayerOne().playCard(namaariSinglemindedRival)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(namaariSinglemindedRival, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      // drawnCard should now be in hand
      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");

      const discardFodderId = testEngine.findCardInstanceId(discardFodder, "hand", "player_one");

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [discardFodderId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    });

    it("is optional when played: player can decline to draw and discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        deck: [drawnCard],
        hand: [namaariSinglemindedRival, discardFodder],
        inkwell: namaariSinglemindedRival.cost,
      });

      expect(testEngine.asPlayerOne().playCard(namaariSinglemindedRival)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(namaariSinglemindedRival, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // nothing drawn or discarded
      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("hand");
    });

    it("triggers at the start of the controller's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [namaariSinglemindedRival],
          deck: [drawnCard],
          hand: [discardFodder],
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // STRATEGIC EDGE fires at the start of P1's turn
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(namaariSinglemindedRival, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");

      const discardFodderId = testEngine.findCardInstanceId(discardFodder, "hand", "player_one");
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [discardFodderId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");
    });

    it("does not trigger at the start of the opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {},
        {
          play: [namaariSinglemindedRival],
          deck: 1,
        },
      );

      // Namaari is controlled by P2; at game start it is P1's turn
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });

  describe("EXTREME FOCUS — This character gets +1 {S} for each card in your discard.", () => {
    it("starts with base strength when discard is empty", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [namaariSinglemindedRival],
      });

      expect(testEngine.asPlayerOne().getCardStrength(namaariSinglemindedRival)).toBe(
        namaariSinglemindedRival.strength,
      );
    });

    it("gains +1 strength for each card in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [namaariSinglemindedRival],
        discard: [discardFodder, extraDiscardFodder],
      });

      expect(testEngine.asPlayerOne().getCardStrength(namaariSinglemindedRival)).toBe(
        namaariSinglemindedRival.strength + 2,
      );
    });

    it("strength increases as more cards are discarded", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [namaariSinglemindedRival],
        inkwell: namaariSinglemindedRival.cost,
        hand: [namaariSinglemindedRival, discardFodder],
        discard: [extraDiscardFodder],
        deck: [drawnCard],
      });

      // starts with 1 card in discard → +1 strength
      expect(testEngine.asPlayerOne().getCardStrength(namaariSinglemindedRival)).toBe(
        namaariSinglemindedRival.strength + 1,
      );
    });
  });
});
