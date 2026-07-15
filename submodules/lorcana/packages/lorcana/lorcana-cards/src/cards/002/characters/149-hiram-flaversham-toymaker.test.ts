import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { pawpsicle } from "../items/169-pawpsicle";
import { hiramFlavershamToymaker } from "./149-hiram-flaversham-toymaker";
import { runMissingCharacterTest } from "./test-helpers";

runMissingCharacterTest(hiramFlavershamToymaker);

describe("Hiram Flaversham - Toymaker", () => {
  describe("ARTIFICER - you may banish one of your items to draw 2 cards", () => {
    it("does not draw cards when the optional is accepted with no item to banish", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [hiramFlavershamToymaker],
        inkwell: hiramFlavershamToymaker.cost,
        deck: 3,
      });

      expect(testEngine.asPlayerOne().playCard(hiramFlavershamToymaker)).toBeSuccessfulCommand();

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count;
      const deckBefore = testEngine.asPlayerOne().getCardsInZone("deck", "player_one").count;

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(hiramFlavershamToymaker, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count).toBe(handBefore);
      expect(testEngine.asPlayerOne().getCardsInZone("deck", "player_one").count).toBe(deckBefore);
    });

    it("draws 2 cards after banishing one of your items", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [hiramFlavershamToymaker],
        inkwell: hiramFlavershamToymaker.cost,
        play: [pawpsicle],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().playCard(hiramFlavershamToymaker)).toBeSuccessfulCommand();

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count;

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(hiramFlavershamToymaker, {
          resolveOptional: true,
          targets: [pawpsicle],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(pawpsicle)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count).toBe(
        handBefore + 2,
      );
    });
  });
});
