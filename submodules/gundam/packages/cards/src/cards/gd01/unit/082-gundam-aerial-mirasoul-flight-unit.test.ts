import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  findStatModifier,
} from "@tcg/gundam-engine";
import { gd01GundamAerialMirasoulFlightUnit082 } from "./082-gundam-aerial-mirasoul-flight-unit.ts";

describe("Gundam Aerial (Mirasoul Flight Unit) (GD01-082)", () => {
  it("【During Pair】【Activate·Action】【Once per Turn】②：Choose 1 enemy Unit. It gets AP-1 during this battle.", () => {
    const pilot = createMockPilot({ name: "Test Pilot", level: 1, cost: 1 });
    const enemy = createMockUnit({ ap: 3, hp: 5 });

    const engine = GundamTestEngine.create(
      {
        hand: [gd01GundamAerialMirasoulFlightUnit082, pilot],
        resourceArea: activeResources(8),
        deck: 5,
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.deployUnit(gd01GundamAerialMirasoulFlightUnit082));
    expectSuccess(p1.assignPilot(pilot, gd01GundamAerialMirasoulFlightUnit082));

    // Move to action-step of end-phase so activate:action is legal.
    engine.setPhase("end-phase");
    engine.setStep("action-step");

    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(
      p1.activateAbility(gd01GundamAerialMirasoulFlightUnit082, 0, { targets: [enemyId] }),
    );

    // AP-1 modifier should be applied to the enemy.
    const mod = findStatModifier(engine, enemyId, "ap");
    expect(mod).toBeDefined();
    expect(mod!.modifier).toBe(-1);
  });
});
