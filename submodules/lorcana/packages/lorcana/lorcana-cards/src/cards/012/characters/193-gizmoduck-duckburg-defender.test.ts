import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { dragonFire } from "../../001/actions/130-dragon-fire";
import { hesGotASword } from "../../001/actions/132-hes-got-a-sword";
import { gizmoduckDuckburgDefender } from "./193-gizmoduck-duckburg-defender";

describe("Gizmoduck - Duckburg Defender", () => {
  it("has Resist +1", () => {
    const testEngine = new LorcanaTestEngine({
      play: [gizmoduckDuckburgDefender],
    });

    const cardModel = testEngine.getCardModel(gizmoduckDuckburgDefender);
    expect(cardModel.hasResist).toBe(true);
    expect(cardModel.damageReduction).toBe(1);
  });

  describe("FAIL-SAFE", () => {
    it("prevents opponents from playing actions with cost 4 or more when controller has no cards in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dragonFire],
          inkwell: dragonFire.cost,
          deck: [dragonFire],
        },
        {
          play: [gizmoduckDuckburgDefender],
          // empty hand
          deck: [gizmoduckDuckburgDefender],
        },
      );

      expect(testEngine.asPlayerOne().canPlayCard(dragonFire)).toBe(false);
      expect(testEngine.asPlayerOne().playCard(dragonFire).success).toBe(false);
    });

    it("does NOT prevent opponents from playing actions with cost less than 4", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [hesGotASword],
          inkwell: hesGotASword.cost,
          deck: [hesGotASword],
        },
        {
          play: [gizmoduckDuckburgDefender],
          deck: [gizmoduckDuckburgDefender],
        },
      );

      expect(testEngine.asPlayerOne().playCard(hesGotASword).success).toBe(true);
    });

    it("does NOT prevent opponents from playing actions when controller has cards in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dragonFire],
          inkwell: dragonFire.cost,
          deck: [dragonFire],
        },
        {
          hand: [gizmoduckDuckburgDefender],
          play: [gizmoduckDuckburgDefender],
          deck: [gizmoduckDuckburgDefender],
        },
      );

      expect(testEngine.asPlayerOne().playCard(dragonFire).success).toBe(true);
    });
  });
});
