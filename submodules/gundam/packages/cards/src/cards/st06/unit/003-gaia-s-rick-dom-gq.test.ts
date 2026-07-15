import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, createMockUnit, expectSuccess } from "@tcg/gundam-engine";
import { st06GaiaSRickDomGq003 } from "./003-gaia-s-rick-dom-gq.ts";

describe("Gaia's Rick Dom (GQ) (ST06-003)", () => {
  it("【Activate･Main】<Support 1> rest this unit to buff a friendly unit by AP+1", () => {
    const target = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create({ play: [st06GaiaSRickDomGq003, target] }, {});
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
    expect(buff?.payload.kind === "stat-modifier" && buff.payload.modifier).toBe(1);
  });
});
