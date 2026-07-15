import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001/characters/020-simba-protective-cub";
import { goofyDaredevil } from "../../001/characters/111-goofy-daredevil";
import { dinglehopper } from "../../001/items/032-dinglehopper";
import { duckburgFunsosFunzone } from "../locations/034-duckburg-funsos-funzone";
import { begone } from "./061-begone";

describe("Begone!", () => {
  describe("Return character with cost 3 or less", () => {
    it("should return opponent's character with cost 2 to their hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [begone],
          inkwell: begone.cost,
        },
        {
          play: [simbaProtectiveCub], // cost 2
        },
      );

      const playResult = testEngine.asPlayerOne().playCard(begone, {
        targets: [simbaProtectiveCub],
      });

      expect(playResult).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(begone)).toBe("discard");
    });

    it("should return your own character to your hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [begone],
          inkwell: begone.cost,
          play: [simbaProtectiveCub], // cost 2
        },
        {},
      );

      const playResult = testEngine.asPlayerOne().playCard(begone, {
        targets: [simbaProtectiveCub],
      });

      expect(playResult).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(begone)).toBe("discard");
    });
  });

  describe("Return item with cost 3 or less", () => {
    it("should return opponent's item with cost 1 to their hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [begone],
          inkwell: begone.cost,
        },
        {
          play: [dinglehopper], // cost 1
        },
      );

      const playResult = testEngine.asPlayerOne().playCard(begone, {
        targets: [dinglehopper],
      });

      expect(playResult).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardZone(dinglehopper)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(begone)).toBe("discard");
    });
  });

  describe("Return location with cost 3 or less", () => {
    it("should return opponent's location with cost 2 to their hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [begone],
          inkwell: begone.cost,
        },
        {
          play: [duckburgFunsosFunzone], // cost 2
        },
      );

      const playResult = testEngine.asPlayerOne().playCard(begone, {
        targets: [duckburgFunsosFunzone],
      });

      expect(playResult).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardZone(duckburgFunsosFunzone)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(begone)).toBe("discard");
    });
  });

  describe("Cost restriction", () => {
    it("should not return a character with cost greater than 3", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [begone],
          inkwell: begone.cost,
        },
        {
          play: [goofyDaredevil], // cost 5
        },
      );

      const playResult = testEngine.asPlayerOne().playCard(begone, {
        targets: [goofyDaredevil],
      });

      // Card is played but the target is invalid (cost > 3), so effect fizzles
      expect(testEngine.asPlayerTwo().getCardZone(goofyDaredevil)).toBe("play");
    });

    it("should work when there are multiple valid targets in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [begone],
          inkwell: begone.cost,
        },
        {
          play: [simbaProtectiveCub, dinglehopper],
        },
      );

      const playResult = testEngine.asPlayerOne().playCard(begone, {
        targets: [simbaProtectiveCub],
      });

      expect(playResult).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("hand");
      expect(testEngine.asPlayerTwo().getCardZone(dinglehopper)).toBe("play");
    });
  });
});
