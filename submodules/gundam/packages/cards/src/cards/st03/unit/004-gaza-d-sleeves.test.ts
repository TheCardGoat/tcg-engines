import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, createMockUnit, expectSuccess } from "@tcg/gundam-engine";
import { st03GazaDSleeves004 } from "./004-gaza-d-sleeves.ts";

describe("Gaza D (Sleeves) (ST03-004)", () => {
  it("【Activate･Main】<Support 2> rest this unit to buff a friendly unit by AP+2", () => {
    const target = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create({ play: [st03GazaDSleeves004, target] }, {});
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [supporterId, targetId] = p1.getCardsInZone("battleArea");
    if (!supporterId || !targetId) throw new Error("setup failed");

    expectSuccess(p1.useSupport(supporterId, targetId));

    expect(engine.getG().exhausted[supporterId]).toBe(true);
    const buff = engine
      .getG()
      .continuousEffects.find(
        (e) =>
          e.targetId === targetId &&
          e.payload.kind === "stat-modifier" &&
          e.payload.stat === "ap" &&
          e.duration === "this-turn",
      );
    expect(buff).toBeDefined();
    expect(buff?.payload.kind === "stat-modifier" && buff.payload.modifier).toBe(2);
  });
});
