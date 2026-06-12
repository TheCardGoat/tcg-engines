import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04FightingAlone119 } from "./119-fighting-alone.ts";

describe("Fighting Alone (GD04-119)", () => {
  it("【Main】 registers a prevent-damage continuous effect on a Unit paired with a Newtype Pilot", () => {
    const newtypePilot = createMockPilot({
      name: "Newtype Test",
      traits: ["newtype"],
      level: 1,
      cost: 1,
    });
    const friendlyUnit = createMockUnit({ ap: 2, hp: 4 });

    const engine = GundamTestEngine.create({
      hand: [gd04FightingAlone119, newtypePilot],
      play: [friendlyUnit],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(newtypePilot, friendlyId));
    expectSuccess(p1.playCommand(gd04FightingAlone119, { targets: [friendlyId] }));

    // The prevent-damage effect should be on the chosen friendly Unit.
    const preventEntries = engine
      .getG()
      .continuousEffects.filter(
        (e) => e.targetId === friendlyId && e.payload.kind === "prevent-damage",
      );
    expect(preventEntries).toHaveLength(1);
  });

  it("【Main】 cannot target a friendly Unit not paired with a Newtype Pilot", () => {
    const civilianPilot = createMockPilot({
      name: "Civilian Test",
      traits: ["civilian"],
      level: 1,
      cost: 1,
    });
    const friendlyUnit = createMockUnit({ ap: 2, hp: 4 });

    const engine = GundamTestEngine.create({
      hand: [gd04FightingAlone119, civilianPilot],
      play: [friendlyUnit],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(civilianPilot, friendlyId));

    // playCommand should fail because the target filter has no legal candidate
    // (the only friendly Unit is paired with a Civilian, not a Newtype).
    const result = p1.playCommand(gd04FightingAlone119, { targets: [friendlyId] });
    expect(result.success).toBe(false);
  });
});
