import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  getDamageCounter,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd03GquuuuuuxOmegaPsycommu034 } from "./034-gquuuuuux-omega-psycommu.ts";

describe("GQuuuuuuX (Omega Psycommu) (GD03-034)", () => {
  it("has Suppression and 【Deploy】 deals 3 damage to an enemy Unit", () => {
    const target = createMockUnit({ hp: 6 });
    const engine = GundamTestEngine.create(
      { hand: [gd03GquuuuuuxOmegaPsycommu034], resourceArea: activeResources(8) },
      { play: [target] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const targetId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd03GquuuuuuxOmegaPsycommu034, { targets: [targetId] }));

    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const framework = engine.getRuntime().getFrameworkReadAPI();
    expect(getEffectiveStats(unitId, engine.getG(), framework.cards, framework).keywords).toContain(
      "Suppression",
    );
    expect(getDamageCounter(engine, targetId)).toBe(3);
  });
});
