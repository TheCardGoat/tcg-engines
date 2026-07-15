import { describe, expect, it } from "bun:test";
import {
  CANONICAL_PLAYER_ONE,
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { donaldDuckFocusedFlatfoot } from "./155-donald-duck-focused-flatfoot";

const topDeckCard = createMockCharacter({
  id: "donald-focused-flatfoot-top-deck",
  name: "Top Deck Card",
  cost: 2,
});

describe("Donald Duck - Focused Flatfoot", () => {
  describe("BAFFLING MYSTERY - When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.", () => {
    it("puts the top card of your deck into your inkwell facedown and exerted when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [donaldDuckFocusedFlatfoot],
        inkwell: donaldDuckFocusedFlatfoot.cost,
        deck: [topDeckCard],
      });

      expect(testEngine.asPlayerOne().playCard(donaldDuckFocusedFlatfoot)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(topDeckCard)).toBe("inkwell");
      expect(testEngine.getCard(topDeckCard)?.exerted).toBe(true);
      expect(testEngine.isCardFaceDown(topDeckCard, "inkwell", CANONICAL_PLAYER_ONE)).toBe(true);
    });

    it("does not put the top card of your deck into the inkwell when declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [donaldDuckFocusedFlatfoot],
        inkwell: donaldDuckFocusedFlatfoot.cost,
        deck: [topDeckCard],
      });

      expect(testEngine.asPlayerOne().playCard(donaldDuckFocusedFlatfoot)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(topDeckCard)).toBe("deck");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
