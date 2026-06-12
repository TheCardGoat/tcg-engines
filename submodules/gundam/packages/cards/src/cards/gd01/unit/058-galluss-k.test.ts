import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01GallussK058 } from "./058-galluss-k.ts";

describe("Galluss-K (GD01-058)", () => {
  it("【Activate·Action】①：AP+1 on the chosen Lv.4+ Unit (targets honoured)", () => {
    const highLv1 = createMockUnit({ ap: 4, hp: 4, level: 4 });
    const highLv2 = createMockUnit({ ap: 4, hp: 4, level: 5 });
    const engine = GundamTestEngine.create(
      {
        play: [gd01GallussK058, highLv1],
        resourceArea: activeResources(3),
      },
      { play: [highLv2] },
    );
    engine.setPhase("end-phase");
    engine.setStep("action-step");

    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [_gallussId, friendlyId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    if (!friendlyId || !enemyId) throw new Error("setup failed");

    // Buff the enemy high-level unit (target `owner: "any"` so either side works).
    expectSuccess(p1.activateAbility(gd01GallussK058, 0, { targets: [enemyId] }));

    const apMods = engine
      .getG()
      .continuousEffects.filter(
        (e) => e.payload.kind === "stat-modifier" && e.payload.stat === "ap",
      );
    expect(apMods).toHaveLength(1);
    expect(apMods[0]!.targetId).toBe(enemyId);
    expect(apMods.find((e) => e.targetId === friendlyId)).toBeUndefined();
  });
});
