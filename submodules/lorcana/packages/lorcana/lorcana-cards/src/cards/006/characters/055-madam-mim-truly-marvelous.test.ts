import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { madamMimTrulyMarvelous } from "./055-madam-mim-truly-marvelous";

const handCard = createMockCharacter({
  id: "madam-mim-hand-card",
  name: "Hand Card",
  cost: 1,
});

describe("Madam Mim - Truly Marvelous", () => {
  describe("OH, BAT GIZZARDS 2 - {I}, Choose and discard a card - Gain 1 lore.", () => {
    it("gains 1 lore when paying 2 ink and discarding a card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [madamMimTrulyMarvelous],
        hand: [handCard],
        inkwell: 2,
        deck: 1,
      });

      const initialLore = testEngine.asPlayerOne().getLore("player_one");

      expect(
        testEngine.asPlayerOne().activateAbility(madamMimTrulyMarvelous, {
          costs: { discardCards: [handCard] },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(handCard)).toBe("discard");
      expect(testEngine.asPlayerOne().getLore("player_one")).toBe(initialLore + 1);
    });

    it("cannot activate without a card to discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [madamMimTrulyMarvelous],
        hand: [],
        inkwell: 2,
        deck: 1,
      });

      const result = testEngine.asPlayerOne().activateAbility(madamMimTrulyMarvelous);

      expect(result.success).toBe(false);
    });

    it("cannot activate without explicitly choosing a discard when exactly one card is in hand (discardChosen)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [madamMimTrulyMarvelous],
        hand: [handCard],
        inkwell: 2,
        deck: 1,
      });

      const result = testEngine.asPlayerOne().activateAbility(madamMimTrulyMarvelous);

      expect(result.success).toBe(false);
    });

    it("cannot activate without enough ink", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [madamMimTrulyMarvelous],
        hand: [handCard],
        inkwell: 1,
        deck: 1,
      });

      const result = testEngine.asPlayerOne().activateAbility(madamMimTrulyMarvelous, {
        costs: { discardCards: [handCard] },
      });

      expect(result.success).toBe(false);
    });
  });
});
