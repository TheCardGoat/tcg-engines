import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
  findStatModifier,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { st05CgsMobileWorker003 } from "./003-cgs-mobile-worker.ts";

describe("CGS Mobile Worker (ST05-003)", () => {
  it("【Activate･Main】 Rest this Unit: chosen friendly unit takes 1 damage and gains AP+1", () => {
    const target = createMockUnit({ ap: 2, hp: 5 });
    const engine = GundamTestEngine.create({
      play: [st05CgsMobileWorker003, target],
      resourceArea: activeResources(3),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [selfId, targetId] = p1.getCardsInZone("battleArea");
    if (!selfId || !targetId) throw new Error("play setup failed");

    expectSuccess(p1.activateAbility(selfId, 0, { targets: [targetId] }));

    expect(p1.isExhausted(selfId)).toBe(true);
    expect(getDamageCounter(engine, targetId)).toBe(1);
    expect(findStatModifier(engine, targetId, "ap")?.modifier).toBe(1);
  });
});
