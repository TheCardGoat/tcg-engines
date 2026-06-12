import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mulanInjuredSoldier } from "./125-mulan-injured-soldier";

describe("Mulan - Injured Soldier (Set 9)", () => {
  describe("BATTLE WOUND - This character enters play with 2 damage.", () => {
    it("enters play with 2 damage counters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mulanInjuredSoldier],
        inkwell: mulanInjuredSoldier.cost,
      });

      expect(testEngine.asPlayerOne().playCard(mulanInjuredSoldier)).toBeSuccessfulCommand();

      const mulan = testEngine.asPlayerOne().getCard(mulanInjuredSoldier);
      expect(mulan.damage).toBe(2);
    });

    it("survives because her willpower (3) is greater than the damage (2)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mulanInjuredSoldier],
        inkwell: mulanInjuredSoldier.cost,
      });

      expect(testEngine.asPlayerOne().playCard(mulanInjuredSoldier)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(mulanInjuredSoldier)).toBe("play");
    });
  });
});
