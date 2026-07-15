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

function setupPairedEnemy(level: number) {
  const enemyUnit = createMockUnit({ level, ap: 3, hp: 5 });
  const enemyPilot = createMockPilot({ name: "Enemy Pilot", cost: 1 });
  const engine = GundamTestEngine.create(
    { hand: [gd03EliminateTarget110], resourceArea: activeResources(6), deck: 3 },
    {
      hand: [enemyPilot],
      play: [enemyUnit],
      resourceArea: activeResources(2),
      deck: 3,
    },
    { initialActivePlayer: PLAYER_TWO },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  const commandId = p1.getHand()[0]!;
  const pilotId = p2.getHand()[0]!;
  const unitId = p2.getCardsInZone("battleArea")[0]!;

  expectSuccess(p2.assignPilot(pilotId, unitId));

  return { p1, p2, commandId, pilotId, unitId };
}

describe("Eliminate Target (GD03-110)", () => {
  it("【Main】 destroys a Pilot paired with an enemy Lv.5 Unit", () => {
    const { p1, p2, commandId, pilotId, unitId } = setupPairedEnemy(5);
    expectSuccess(p2.passPhase());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passActionStep());

    expectSuccess(p1.playCommand(commandId, { targets: [pilotId] }));

    expect(p2.getCardZone(pilotId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getPilotId(unitId)).toBeUndefined();
    expect(p2.getCardsInZone("battleArea")).toContain(unitId);
  });

  it("【Action】 destroys the paired Pilot during battle", () => {
    const { p1, p2, commandId, pilotId, unitId } = setupPairedEnemy(5);

    expectSuccess(p2.enterBattle(unitId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.playCommand(commandId, { targets: [pilotId] }));

    expect(p2.getCardZone(pilotId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getPilotId(unitId)).toBeUndefined();
  });

  it("rejects a Pilot paired with an enemy Lv.6 Unit", () => {
    const { p1, p2, commandId, pilotId, unitId } = setupPairedEnemy(6);
    expectSuccess(p2.passPhase());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passActionStep());

    expectFailure(p1.playCommand(commandId, { targets: [pilotId] }), "INVALID_TARGET");

    expect(p2.getPilotId(unitId)).toBe(pilotId);
    expect(p2.getCardZone(pilotId)).toBe(`battleArea:${PLAYER_TWO}`);
    expect(p1.getCardZone(commandId)).toBe(`hand:${PLAYER_ONE}`);
  });
});
