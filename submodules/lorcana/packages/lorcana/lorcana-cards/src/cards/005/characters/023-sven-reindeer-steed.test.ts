import { describe, expect, it } from "bun:test";
import { createMockCharacter, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { svenReindeerSteed } from "./023-sven-reindeer-steed";

const exertedAlly = createMockCharacter({
  id: "sven-test-exerted-ally",
  name: "Exerted Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Sven - Reindeer Steed", () => {
  describe("REINDEER GAMES — When you play this character, you may ready chosen character. They can't quest or challenge for the rest of this turn.", () => {
    it("readies the chosen character when the optional ability is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [svenReindeerSteed],
        inkwell: svenReindeerSteed.cost,
        play: [{ card: exertedAlly, exerted: true }],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().isExerted(exertedAlly)).toBe(true);

      expect(testEngine.asPlayerOne().playCard(svenReindeerSteed)).toBeSuccessfulCommand();

      // The triggered ability should be on the bag (optional)
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

      // Accept the optional ability and provide the target in the same call
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(svenReindeerSteed, {
          resolveOptional: true,
          targets: [exertedAlly],
        }),
      ).toBeSuccessfulCommand();

      // The ally should now be readied
      expect(testEngine.asPlayerOne().isExerted(exertedAlly)).toBe(false);
    });

    it("applies cant-quest-or-challenge restriction to the readied character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [svenReindeerSteed],
        inkwell: svenReindeerSteed.cost,
        play: [{ card: exertedAlly, exerted: true }],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(svenReindeerSteed)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(svenReindeerSteed, {
          resolveOptional: true,
          targets: [exertedAlly],
        }),
      ).toBeSuccessfulCommand();

      // The ally should be ready but have cant-quest-or-challenge restriction
      expect(testEngine.asPlayerOne().isExerted(exertedAlly)).toBe(false);
      expect(testEngine.hasRestriction(exertedAlly, "cant-quest-or-challenge")).toBe(true);
    });

    it("does not ready the chosen character when the optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [svenReindeerSteed],
        inkwell: svenReindeerSteed.cost,
        play: [{ card: exertedAlly, exerted: true }],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(svenReindeerSteed)).toBeSuccessfulCommand();

      // Decline the optional ability
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(svenReindeerSteed, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // The ally should still be exerted
      expect(testEngine.asPlayerOne().isExerted(exertedAlly)).toBe(true);

      // No restrictions should have been applied
      expect(testEngine.hasRestriction(exertedAlly, "cant-quest-or-challenge")).toBe(false);
    });

    it("restrictions expire after the turn ends", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [svenReindeerSteed],
        inkwell: svenReindeerSteed.cost,
        play: [{ card: exertedAlly, exerted: true }],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(svenReindeerSteed)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(svenReindeerSteed, {
          resolveOptional: true,
          targets: [exertedAlly],
        }),
      ).toBeSuccessfulCommand();

      // Restriction should exist this turn
      expect(testEngine.hasRestriction(exertedAlly, "cant-quest-or-challenge")).toBe(true);

      // Pass player one's turn and player two's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Restriction should have expired
      expect(testEngine.hasRestriction(exertedAlly, "cant-quest-or-challenge")).toBe(false);
    });
  });
});
