import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { aWholeNewWorld } from "../../001/actions/195-a-whole-new-world";
import { beOurGuest } from "../../001/actions/025-be-our-guest";
import { kristoffReindeerKeeper } from "./013-kristoff-reindeer-keeper";
import { peteGamesReferee } from "./195-pete-games-referee";

describe("Kristoff - Reindeer Keeper", () => {
  describe("SONG OF THE HERD: For each song card in your discard, you pay 1 less to play this character.", () => {
    it("costs full price with no songs in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [kristoffReindeerKeeper],
        inkwell: kristoffReindeerKeeper.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().getCard(kristoffReindeerKeeper).playCost).toBe(
        kristoffReindeerKeeper.cost,
      );
      expect(testEngine.asPlayerOne().playCard(kristoffReindeerKeeper)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(kristoffReindeerKeeper)).toBe("play");
    });

    it("reduces cost by 1 for each song card in owner's discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [kristoffReindeerKeeper],
        inkwell: kristoffReindeerKeeper.cost - 3,
        discard: [aWholeNewWorld, aWholeNewWorld, aWholeNewWorld],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().getCard(kristoffReindeerKeeper).playCost).toBe(
        kristoffReindeerKeeper.cost - 3,
      );
      expect(testEngine.asPlayerOne().playCard(kristoffReindeerKeeper)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(kristoffReindeerKeeper)).toBe("play");
    });

    it("does not reduce cost for non-song cards in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [kristoffReindeerKeeper],
        inkwell: kristoffReindeerKeeper.cost,
        discard: [peteGamesReferee, peteGamesReferee, peteGamesReferee],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().getCard(kristoffReindeerKeeper).playCost).toBe(
        kristoffReindeerKeeper.cost,
      );
    });

    it("does NOT reduce cost of the next card played after Kristoff", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [kristoffReindeerKeeper, peteGamesReferee],
        inkwell: kristoffReindeerKeeper.cost - 3 + peteGamesReferee.cost,
        discard: [aWholeNewWorld, aWholeNewWorld, aWholeNewWorld],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(kristoffReindeerKeeper)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(kristoffReindeerKeeper)).toBe("play");

      expect(testEngine.asPlayerOne().playCard(peteGamesReferee)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(peteGamesReferee)).toBe("play");
    });
  });

  it("has Bodyguard keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [kristoffReindeerKeeper],
      inkwell: kristoffReindeerKeeper.cost,
      deck: 2,
    });

    testEngine.asPlayerOne().playCard(kristoffReindeerKeeper);
    expect(testEngine.asPlayerOne().hasKeyword(kristoffReindeerKeeper, "Bodyguard")).toBe(true);
  });
});
