import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03EliminateTarget110 } from "./110-eliminate-target.ts";

describe("Eliminate Target (GD03-110)", () => {
  it("【Main】/【Action】destroys a Pilot paired with an enemy Lv.5-or-lower Unit", () => {
    const enemyUnit = createMockUnit({ level: 5, cost: 1, linkCondition: "[Enemy Pilot]" });
    const enemyPilot = createMockPilot({ name: "Enemy Pilot", level: 1, cost: 1 });
    const engine = GundamTestEngine.create(
      { hand: [gd03EliminateTarget110], resourceArea: activeResources(7) },
      { play: [enemyUnit, enemyPilot] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    const [enemyUnitId, enemyPilotId] = p2.getCardsInZone("battleArea");
    engine.getG().pilotAssignments[enemyUnitId!] = enemyPilotId!;

    expectSuccess(p1.playCommand(gd03EliminateTarget110, { targets: [enemyPilotId!] }));

    expect(engine.getState().ctx.zones.private.cardIndex[enemyPilotId!]?.zoneKey).toBe(
      `trash:${PLAYER_TWO}`,
    );
    expect(engine.getG().pilotAssignments[enemyUnitId!]).toBeUndefined();
  });

  it("rejects a Pilot paired with an enemy Lv.6 Unit", () => {
    const enemyUnit = createMockUnit({ level: 6, cost: 1, linkCondition: "[Enemy Pilot]" });
    const enemyPilot = createMockPilot({ name: "Enemy Pilot", level: 1, cost: 1 });
    const engine = GundamTestEngine.create(
      { hand: [gd03EliminateTarget110], resourceArea: activeResources(7) },
      { play: [enemyUnit, enemyPilot] },
    );
    const p2 = engine.asPlayer(PLAYER_TWO);

    const [enemyUnitId, enemyPilotId] = p2.getCardsInZone("battleArea");
    engine.getG().pilotAssignments[enemyUnitId!] = enemyPilotId!;

    expectFailure(
      engine.asPlayer(PLAYER_ONE).playCommand(gd03EliminateTarget110, { targets: [enemyPilotId!] }),
      "INVALID_TARGET",
    );
  });
});
