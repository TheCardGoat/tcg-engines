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
import { gd01Darilbalde075 } from "./075-darilbalde.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Darilbalde (GD01-075)", () => {
  it("returns the chosen 1-HP enemy, links with an Academy Pilot, and attacks this turn", () => {
    const academyPilot = createMockPilot({ traits: ["academy"], level: 1, cost: 1 });
    const enemyPilot = createMockPilot({
      name: "Paired Enemy Pilot",
      hpBonus: 0,
      level: 1,
      cost: 1,
    });
    const chosenEnemy = createMockUnit({ hp: 1 });
    const otherOneHpEnemy = createMockUnit({ hp: 1 });
    const battleTarget = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01Darilbalde075, academyPilot],
        deck: 2,
        resourceArea: activeResources(4),
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      {
        hand: [enemyPilot],
        play: [chosenEnemy, otherOneHpEnemy, battleTarget],
        resourceArea: activeResources(1),
      },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [chosenEnemyId, otherEnemyId, battleTargetId] = p2.getCardsInZone("battleArea");
    const enemyPilotId = p2.getHand()[0]!;

    expectSuccess(p2.assignPilot(enemyPilot, chosenEnemyId!));
    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [battleTargetId!]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);

    expectSuccess(p1.deployUnit(gd01Darilbalde075));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([chosenEnemyId, otherEnemyId]),
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [chosenEnemyId!] }));

    expect(p2.getCardZone(chosenEnemyId!)).toBe(`hand:${PLAYER_TWO}`);
    expect(p2.getCardZone(enemyPilotId)).toBe(`hand:${PLAYER_TWO}`);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getCardZone(otherEnemyId!)).toBe(`battleArea:${PLAYER_TWO}`);
    const darilbaldeId = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(academyPilot, darilbaldeId));
    expectSuccess(p1.enterBattle(darilbaldeId, battleTargetId!));
  });

  it("rejects an enemy Unit with more than 1 HP", () => {
    const enemy = createMockUnit({ hp: 2 });
    const engine = GundamTestEngine.create(
      { hand: [gd01Darilbalde075], resourceArea: activeResources(3) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectFailure(p1.deployUnit(gd01Darilbalde075, { targets: [enemyId] }), "INVALID_TARGET");

    expect(p2.getCardZone(enemyId)).toBe(`battleArea:${PLAYER_TWO}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(1);
  });
});
