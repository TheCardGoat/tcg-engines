import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01Bucue055 } from "./055-bucue.ts";

describe("BuCUE (GD01-055)", () => {
  it("【Activate·Main】<Support 2> buffs only the chosen friendly Unit by AP+2", () => {
    const ally1 = createMockUnit({ ap: 3, hp: 3 });
    const ally2 = createMockUnit({ ap: 3, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [gd01Bucue055, ally1, ally2], resourceArea: activeResources(3) },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [supporterId, ally1Id, ally2Id] = p1.getCardsInZone("battleArea");
    if (!supporterId || !ally1Id || !ally2Id) throw new Error("setup failed");

    expectSuccess(p1.useSupport(supporterId, ally1Id));

    expect(engine.getG().exhausted[supporterId]).toBe(true);
    const apBuffs = engine
      .getG()
      .continuousEffects.filter(
        (e) => e.payload.kind === "stat-modifier" && e.payload.stat === "ap",
      );
    expect(apBuffs).toHaveLength(1);
    expect(apBuffs[0]!.targetId).toBe(ally1Id);
    expect(apBuffs.find((e) => e.targetId === ally2Id)).toBeUndefined();
    expect(apBuffs[0]!.payload.kind === "stat-modifier" && apBuffs[0]!.payload.modifier).toBe(2);
  });
});
