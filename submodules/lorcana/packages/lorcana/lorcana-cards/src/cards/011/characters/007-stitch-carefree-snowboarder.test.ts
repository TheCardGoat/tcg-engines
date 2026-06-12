import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { heiheiBoatSnack, simbaProtectiveCub } from "../../001";
import { stitchCarefreeSnowboarder } from "./007-stitch-carefree-snowboarder";

describe("Stitch - Carefree Snowboarder", () => {
  it("can be played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [stitchCarefreeSnowboarder],
      inkwell: stitchCarefreeSnowboarder.cost,
    });

    expect(testEngine.asPlayerOne().playCard(stitchCarefreeSnowboarder)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(stitchCarefreeSnowboarder)).toBe("play");
  });

  describe("BRING YOUR FRIENDS - Whenever this character quests, if you have 2 or more other characters in play, you may draw a card", () => {
    it("draws a card when questing with 2 or more other characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [stitchCarefreeSnowboarder, simbaProtectiveCub, heiheiBoatSnack],
        deck: 5,
      });

      const handBefore = testEngine.asPlayerOne().getZonesCardCount().hand;
      const deckBefore = testEngine.asPlayerOne().getZonesCardCount().deck;

      expect(testEngine.asPlayerOne().quest(stitchCarefreeSnowboarder)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore("player_one")).toBe(stitchCarefreeSnowboarder.lore);

      // Resolve the optional triggered ability from the bag
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      for (const effect of bagEffects) {
        testEngine.asPlayerOne().resolvePendingByCard(stitchCarefreeSnowboarder);
      }

      const handAfter = testEngine.asPlayerOne().getZonesCardCount().hand;
      const deckAfter = testEngine.asPlayerOne().getZonesCardCount().deck;

      expect(handAfter).toBe(handBefore + 1);
      expect(deckAfter).toBe(deckBefore - 1);
    });

    it("the draw is optional when 2 or more other characters are in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [stitchCarefreeSnowboarder, simbaProtectiveCub, heiheiBoatSnack],
        deck: 5,
      });

      const handBefore = testEngine.asPlayerOne().getZonesCardCount().hand;
      const deckBefore = testEngine.asPlayerOne().getZonesCardCount().deck;

      expect(testEngine.asPlayerOne().quest(stitchCarefreeSnowboarder)).toBeSuccessfulCommand();

      // Bag has the optional ability
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

      // Decline the optional draw effect
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(stitchCarefreeSnowboarder, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      const handAfter = testEngine.asPlayerOne().getZonesCardCount().hand;
      const deckAfter = testEngine.asPlayerOne().getZonesCardCount().deck;

      expect(handAfter).toBe(handBefore);
      expect(deckAfter).toBe(deckBefore);
    });

    it("does not trigger when there is only 1 other character in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [stitchCarefreeSnowboarder, simbaProtectiveCub],
        deck: 5,
      });

      const handBefore = testEngine.asPlayerOne().getZonesCardCount().hand;
      const deckBefore = testEngine.asPlayerOne().getZonesCardCount().deck;

      expect(testEngine.asPlayerOne().quest(stitchCarefreeSnowboarder)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore("player_one")).toBe(stitchCarefreeSnowboarder.lore);

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      const handAfter = testEngine.asPlayerOne().getZonesCardCount().hand;
      const deckAfter = testEngine.asPlayerOne().getZonesCardCount().deck;

      expect(handAfter).toBe(handBefore);
      expect(deckAfter).toBe(deckBefore);
    });

    it("does not trigger when Stitch is the only character in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [stitchCarefreeSnowboarder],
        deck: 5,
      });

      const handBefore = testEngine.asPlayerOne().getZonesCardCount().hand;
      const deckBefore = testEngine.asPlayerOne().getZonesCardCount().deck;

      expect(testEngine.asPlayerOne().quest(stitchCarefreeSnowboarder)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore("player_one")).toBe(stitchCarefreeSnowboarder.lore);

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      const handAfter = testEngine.asPlayerOne().getZonesCardCount().hand;
      const deckAfter = testEngine.asPlayerOne().getZonesCardCount().deck;

      expect(handAfter).toBe(handBefore);
      expect(deckAfter).toBe(deckBefore);
    });
  });
});
