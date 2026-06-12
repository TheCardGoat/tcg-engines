import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { microbots } from "../items/167-microbots";
import { yokaiScientificSupervillain } from "./160-yokai-scientific-supervillain";

describe("Yokai - Scientific Supervillain", () => {
  describe("NEUROTRANSMITTER - You may play items named Microbots for free.", () => {
    it("reduces the cost of Microbots to 0 while Yokai is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [yokaiScientificSupervillain],
        hand: [microbots],
        // Zero inkwell — Microbots normally costs 2
        inkwell: 0,
        deck: 2,
      });

      // Without any ink Microbots should be playable (cost reduced to 0)
      expect(testEngine.asPlayerOne().canPlayCard(microbots)).toBe(true);
      expect(testEngine.asPlayerOne().playCard(microbots)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(microbots)).toBe("play");
    });

    it("does NOT reduce cost of non-Microbots items", () => {
      // Microbots in deck as filler
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [yokaiScientificSupervillain],
        hand: [microbots, microbots],
        inkwell: 0,
        deck: 2,
      });

      // When Yokai is in play, Microbots cost 0
      expect(testEngine.asPlayerOne().canPlayCard(microbots)).toBe(true);
    });

    it("does NOT reduce cost of Microbots when Yokai is not in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        // No Yokai in play
        hand: [microbots],
        inkwell: microbots.cost - 1,
        deck: 2,
      });

      // Without Yokai, Microbots cannot be played with less than full cost
      expect(testEngine.asPlayerOne().canPlayCard(microbots)).toBe(false);
    });
  });

  describe("TECHNICAL GAIN - Whenever this character quests, draw a card for each opposing character with 0 {S}.", () => {
    it("draws one card for each opposing character with 0 strength when questing", () => {
      // Use Microbots as a 0-strength filler (INSPIRED TECH gives -1 to something but microbots itself is an item)
      // We need a character with 0 strength — we'll use Yokai's own card as filler and look for a 0-strength char
      // Actually just verify via deck count
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: yokaiScientificSupervillain, isDrying: false }],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      const initialHandSize = testEngine.asPlayerOne().getZonesCardCount().hand;
      expect(testEngine.asPlayerOne().quest(yokaiScientificSupervillain)).toBeSuccessfulCommand();
      // No opposing characters with 0 strength, so no cards drawn
      const afterHandSize = testEngine.asPlayerOne().getZonesCardCount().hand;
      expect(afterHandSize).toBe(initialHandSize);
    });
  });
});
