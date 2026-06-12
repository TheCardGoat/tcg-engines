import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { peterPanLostBoyLeader } from "./082-peter-pan-lost-boy-leader";
import { forbiddenMountainMaleficentsCastle } from "../locations/066-forbidden-mountain-maleficents-castle";
import { neverLandMermaidLagoon } from "../locations/032-never-land-mermaid-lagoon";

describe("Peter Pan - Lost Boy Leader", () => {
  describe("I CAME TO LISTEN TO THE STORIES - Once per turn, when this character moves to a location, gain lore equal to that location's {L}.", () => {
    it("gains lore equal to the location's lore value when moving to a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [peterPanLostBoyLeader, forbiddenMountainMaleficentsCastle, neverLandMermaidLagoon],
        inkwell: forbiddenMountainMaleficentsCastle.moveCost + neverLandMermaidLagoon.moveCost,
      });

      const loreBefore = testEngine.getLore("player_one");

      expect(
        testEngine
          .asPlayerOne()
          .moveCharacterToLocation(peterPanLostBoyLeader, forbiddenMountainMaleficentsCastle),
      ).toBeSuccessfulCommand();

      // The gain-lore triggered ability auto-resolves (no player decision needed)
      expect(testEngine.getLore("player_one")).toBe(
        loreBefore + forbiddenMountainMaleficentsCastle.lore,
      );
    });

    it("only triggers once per turn (second move to different location does NOT gain lore)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [peterPanLostBoyLeader, forbiddenMountainMaleficentsCastle, neverLandMermaidLagoon],
        inkwell: forbiddenMountainMaleficentsCastle.moveCost + neverLandMermaidLagoon.moveCost,
      });

      testEngine
        .asPlayerOne()
        .moveCharacterToLocation(peterPanLostBoyLeader, forbiddenMountainMaleficentsCastle);

      const loreAfterFirstMove = testEngine.getLore("player_one");

      expect(
        testEngine
          .asPlayerOne()
          .moveCharacterToLocation(peterPanLostBoyLeader, neverLandMermaidLagoon),
      ).toBeSuccessfulCommand();

      // Once-per-turn: second move does not gain lore
      expect(testEngine.getLore("player_one")).toBe(loreAfterFirstMove);
    });
  });
});
