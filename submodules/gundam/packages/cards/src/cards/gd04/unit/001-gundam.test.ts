import { describe, it, expect } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd04Gundam001 } from "./001-gundam.ts";

describe("Gundam (GD04-001)", () => {
  it("【During Link】【Attack】returns its paired blue Pilot when attacking an enemy Unit", () => {
    const amuro = createMockPilot({ name: "Amuro Ray", color: "blue" });
    const enemy = createMockUnit({ hp: 8 });
    const engine = GundamTestEngine.create(
      { play: [gd04Gundam001], hand: [amuro], resourceArea: activeResources(6) },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const gundamId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(amuro, gundamId));
    const pilotId = engine.getG().pilotAssignments[gundamId]!;
    expectSuccess(p1.enterBattle(gundamId, enemyId));

    expect(p1.getCardsInZone("hand")).toContain(pilotId);
    expect(engine.getG().pilotAssignments[gundamId]).toBeUndefined();
  });

  it("does not return its paired Pilot when attacking the enemy player", () => {
    const amuro = createMockPilot({ name: "Amuro Ray", color: "blue" });
    const engine = GundamTestEngine.create({
      play: [gd04Gundam001],
      hand: [amuro],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const gundamId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(amuro, gundamId));
    const pilotId = engine.getG().pilotAssignments[gundamId]!;
    expectSuccess(p1.enterBattle(gundamId, "direct"));

    expect(p1.getCardsInZone("hand")).not.toContain(pilotId);
    expect(engine.getG().pilotAssignments[gundamId]).toBe(pilotId);
  });
});
