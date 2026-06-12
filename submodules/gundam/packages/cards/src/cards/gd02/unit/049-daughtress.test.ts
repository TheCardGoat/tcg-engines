import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02Daughtress049 } from "./049-daughtress.ts";

describe("Daughtress (GD02-049)", () => {
  it("【Activate·Main】<Support 1> buffs only the chosen friendly Unit by AP+1", () => {
    const ally = createMockUnit({ ap: 2, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [gd02Daughtress049, ally], resourceArea: activeResources(3) },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [supporterId, allyId] = p1.getCardsInZone("battleArea");
    if (!supporterId || !allyId) throw new Error("setup failed");

    expectSuccess(p1.useSupport(supporterId, allyId));

    expect(engine.getG().exhausted[supporterId]).toBe(true);
    const apBuffs = engine
      .getG()
      .continuousEffects.filter(
        (e) => e.payload.kind === "stat-modifier" && e.payload.stat === "ap",
      );
    expect(apBuffs).toHaveLength(1);
    expect(apBuffs[0]!.targetId).toBe(allyId);
  });
});
