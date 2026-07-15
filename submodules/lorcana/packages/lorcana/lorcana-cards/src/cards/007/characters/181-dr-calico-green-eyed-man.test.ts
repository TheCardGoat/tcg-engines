import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { drCalicoGreeneyedMan } from "./181-dr-calico-green-eyed-man";

describe("Dr. Calico - Green-Eyed Man", () => {
  describe("YOU'RE BEGINNING TO IRK ME", () => {
    it("should have Resist +2 when undamaged", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [drCalicoGreeneyedMan],
      });

      const card = testEngine.getCard(drCalicoGreeneyedMan);
      expect(card.keywordValues?.resist).toBe(2);
    });

    it("should lose Resist when damaged", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [drCalicoGreeneyedMan],
      });

      testEngine.asServer().manualSetDamage(drCalicoGreeneyedMan, 1);

      const card = testEngine.getCard(drCalicoGreeneyedMan);
      expect(card.keywordValues?.resist ?? 0).toBe(0);
    });
  });
});
