import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04GundamKyriosTailBooster023 } from "./023-gundam-kyrios-tail-booster.ts";

describe("Gundam Kyrios (Tail Booster) (GD04-023)", () => {
  it("【Deploy】 grants attack-target option to a friendly Unit paired with a (Super Soldier) Pilot", () => {
    const superSoldier = createMockPilot({
      name: "Allelujah Test",
      traits: ["super soldier"],
      level: 1,
      cost: 1,
    });
    const friendlyUnit = createMockUnit({ ap: 3, hp: 4 });

    const engine = GundamTestEngine.create({
      hand: [gd04GundamKyriosTailBooster023, superSoldier],
      play: [friendlyUnit],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(superSoldier, friendlyId));
    expectSuccess(p1.deployUnit(gd04GundamKyriosTailBooster023, { targets: [friendlyId] }));

    const grant = engine
      .getG()
      .continuousEffects.find(
        (e) => e.targetId === friendlyId && e.payload.kind === "grant-attack-target-option",
      );
    expect(grant).toBeDefined();
  });

  it("【Deploy】 fails when no friendly Unit is paired with a (Super Soldier) Pilot", () => {
    const friendlyUnit = createMockUnit({ ap: 3, hp: 4 });

    const engine = GundamTestEngine.create({
      hand: [gd04GundamKyriosTailBooster023],
      play: [friendlyUnit],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;

    // The pairedPilotTrait filter has no candidate (the unit is unpaired),
    // so the trigger has nothing to bind to. Deploy still resolves but no
    // grant-attack-target-option is registered.
    expectSuccess(p1.deployUnit(gd04GundamKyriosTailBooster023, { targets: [friendlyId] }));

    const grant = engine
      .getG()
      .continuousEffects.find((e) => e.payload.kind === "grant-attack-target-option");
    expect(grant).toBeUndefined();
  });
});
