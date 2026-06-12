import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { wreckitRalphDemolitionDude } from "./104-wreck-it-ralph-demolition-dude";

describe("Wreck-It Ralph - Demolition Dude", () => {
  describe("REFRESHING BREAK - Whenever you ready this character, gain 1 lore for each 1 damage on him.", () => {
    it("gains lore equal to damage on him when readied", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: wreckitRalphDemolitionDude, exerted: true, damage: 3 }],
        deck: 2,
      });

      const initialLore = testEngine.asPlayerOne().getLore(PLAYER_ONE);
      const ralphId = testEngine.findCardInstanceId(wreckitRalphDemolitionDude, "play");

      testEngine.asServer().manualReadyCard(ralphId);

      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(wreckitRalphDemolitionDude),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(initialLore + 3);
    });

    it("gains no lore when readied with no damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: wreckitRalphDemolitionDude, exerted: true }],
        deck: 2,
      });

      const initialLore = testEngine.asPlayerOne().getLore(PLAYER_ONE);
      const ralphId = testEngine.findCardInstanceId(wreckitRalphDemolitionDude, "play");

      testEngine.asServer().manualReadyCard(ralphId);

      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(wreckitRalphDemolitionDude),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(initialLore);
    });

    it("gains 1 lore when readied with 1 damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: wreckitRalphDemolitionDude, exerted: true, damage: 1 }],
        deck: 2,
      });

      const initialLore = testEngine.asPlayerOne().getLore(PLAYER_ONE);
      const ralphId = testEngine.findCardInstanceId(wreckitRalphDemolitionDude, "play");

      testEngine.asServer().manualReadyCard(ralphId);

      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(wreckitRalphDemolitionDude),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(initialLore + 1);
    });

    it("triggers when readied at start of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { deck: 2 },
        {
          play: [{ card: wreckitRalphDemolitionDude, exerted: true, damage: 2 }],
          deck: 2,
        },
      );

      const initialLore = testEngine.asPlayerTwo().getLore("player_two" as typeof PLAYER_ONE);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      if (testEngine.asPlayerTwo().getBagCount() > 0) {
        expect(
          testEngine.asPlayerTwo().resolvePendingByCard(wreckitRalphDemolitionDude),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerTwo().getLore("player_two" as typeof PLAYER_ONE)).toBe(
        initialLore + 2,
      );
    });
  });
});
