import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd03ZGundamBiosensor071 } from "./071-z-gundam-biosensor.ts";

describe("Z Gundam (Biosensor) (GD03-071)", () => {
  describe("【Deploy】Choose 1 enemy Unit. For each (AEUG) Unit card in your trash, it gets AP-1 during this turn.", () => {
    it("gives an enemy Unit AP-1 for each friendly AEUG Unit card in trash", () => {
      const aeugOne = createMockUnit({ name: "AEUG 1", traits: ["aeug"] });
      const aeugTwo = createMockUnit({ name: "AEUG 2", traits: ["aeug"] });
      const nonAeug = createMockUnit({ name: "Other Trash", traits: ["titans"] });
      const enemy = createMockUnit({ ap: 5, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03ZGundamBiosensor071],
          trash: [aeugOne, aeugTwo, nonAeug],
          resourceArea: activeResources(7),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(gd03ZGundamBiosensor071, { targets: [enemyId] }));

      const framework = engine.getRuntime().getFrameworkReadAPI();
      expect(getEffectiveStats(enemyId, engine.getG(), framework.cards, framework).ap).toBe(3);
    });

    it("applies no AP reduction when there are no friendly AEUG Unit cards in trash", () => {
      const nonAeug = createMockUnit({ name: "Other Trash", traits: ["titans"] });
      const enemy = createMockUnit({ ap: 5, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03ZGundamBiosensor071],
          trash: [nonAeug],
          resourceArea: activeResources(7),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(gd03ZGundamBiosensor071, { targets: [enemyId] }));

      const framework = engine.getRuntime().getFrameworkReadAPI();
      expect(getEffectiveStats(enemyId, engine.getG(), framework.cards, framework).ap).toBe(5);
    });
  });
});
