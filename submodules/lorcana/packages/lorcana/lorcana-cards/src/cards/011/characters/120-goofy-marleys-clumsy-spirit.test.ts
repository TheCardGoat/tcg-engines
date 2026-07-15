import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { goofyMarleysClumsySpirit } from "./120-goofy-marleys-clumsy-spirit";

const exertedAlly = createMockCharacter({
  id: "exerted-ally",
  name: "Exerted Ally",
  strength: 3,
  willpower: 3,
  cost: 2,
});

describe("Goofy - Marley's Clumsy Spirit", () => {
  describe("PREPARE YOURSELF", () => {
    it("readies the chosen exerted character and stops that character from questing for the turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [goofyMarleysClumsySpirit],
        play: [{ card: exertedAlly, exerted: true, isDrying: false }],
        inkwell: goofyMarleysClumsySpirit.cost,
        deck: 5,
      });

      // Verify ally is exerted before
      expect(testEngine.isExerted(exertedAlly)).toBe(true);

      // Play Goofy - triggers PREPARE YOURSELF (goes to bag)
      expect(testEngine.asPlayerOne().playCard(goofyMarleysClumsySpirit)).toBeSuccessfulCommand();

      // Resolve the triggered bag effect: accept the optional ready
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(goofyMarleysClumsySpirit, {
          resolveOptional: true,
          targets: [exertedAlly],
        }),
      ).toBeSuccessfulCommand();

      // Ally should be readied
      expect(testEngine.isExerted(exertedAlly)).toBe(false);
      expect(testEngine.asPlayerOne()).toHaveRestriction({
        card: exertedAlly,
        restriction: "cant-quest",
      });
      expect(testEngine.hasRestriction(goofyMarleysClumsySpirit, "cant-quest")).toBe(false);
    });

    it("does not ready or restrict a character when the optional effect is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [goofyMarleysClumsySpirit],
        play: [{ card: exertedAlly, exerted: true, isDrying: false }],
        inkwell: goofyMarleysClumsySpirit.cost,
        deck: 5,
      });

      // Play Goofy - decline the optional ability
      expect(testEngine.asPlayerOne().playCard(goofyMarleysClumsySpirit)).toBeSuccessfulCommand();

      // Decline the triggered bag effect
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(goofyMarleysClumsySpirit, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // Ally should still be exerted
      expect(testEngine.isExerted(exertedAlly)).toBe(true);
      expect(testEngine.hasRestriction(exertedAlly, "cant-quest")).toBe(false);
      expect(testEngine.hasRestriction(goofyMarleysClumsySpirit, "cant-quest")).toBe(false);
    });
  });
});
