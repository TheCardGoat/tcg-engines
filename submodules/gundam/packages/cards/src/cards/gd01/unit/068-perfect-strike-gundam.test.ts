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
import { gd01PerfectStrikeGundam068 } from "./068-perfect-strike-gundam.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Perfect Strike Gundam (GD01-068)", () => {
  it("uses Blocker to visibly intercept an attack", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const defender = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        deck: 2,
        play: [attacker],
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      { play: [defender, gd01PerfectStrikeGundam068] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const [defenderId, blockerId] = p2.getCardsInZone("battleArea");

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [defenderId!]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);

    expectSuccess(p1.enterBattle(attackerId, defenderId!));
    expectSuccess(p2.declareBlock(blockerId!));

    expect(p1.getBoardView().pendingCombat?.blockerId).toBe(blockerId);
  });

  it("offers only an enemy Unit with 1 HP, returns it to hand, and links with an Earth Alliance Pilot", () => {
    const earthAlliancePilot = createMockPilot({
      traits: ["earth alliance"],
      level: 1,
      cost: 1,
    });
    const eligibleEnemy = createMockUnit({ hp: 1 });
    const secondEligibleEnemy = createMockUnit({ hp: 1 });
    const tooMuchHp = createMockUnit({ hp: 2 });
    const friendlyOneHp = createMockUnit({ hp: 1 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01PerfectStrikeGundam068, earthAlliancePilot],
        deck: 2,
        play: [friendlyOneHp],
        resourceArea: activeResources(5),
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      { play: [eligibleEnemy, secondEligibleEnemy, tooMuchHp] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const [eligibleEnemyId, secondEligibleEnemyId, tooMuchHpId] = p2.getCardsInZone("battleArea");

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [tooMuchHpId!]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);

    expectSuccess(p1.deployUnit(gd01PerfectStrikeGundam068));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([eligibleEnemyId, secondEligibleEnemyId]),
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [eligibleEnemyId!] }));

    expect(p2.getCardZone(eligibleEnemyId!)).toBe(`hand:${PLAYER_TWO}`);
    expect(p2.getCardZone(secondEligibleEnemyId!)).toBe(`battleArea:${PLAYER_TWO}`);
    expect(p2.getCardZone(tooMuchHpId!)).toBe(`battleArea:${PLAYER_TWO}`);
    expect(p1.getCardZone(friendlyId)).toBe(`battleArea:${PLAYER_ONE}`);
    const perfectStrikeId = p1.getCardsInZone("battleArea").find((id) => id !== friendlyId)!;
    expectSuccess(p1.assignPilot(earthAlliancePilot, perfectStrikeId));
    expectSuccess(p1.enterBattle(perfectStrikeId, tooMuchHpId!));
  });

  it("does not open a return prompt when the enemy Unit has more than 1 HP", () => {
    const enemy = createMockUnit({ hp: 2 });
    const engine = GundamTestEngine.create(
      { hand: [gd01PerfectStrikeGundam068], resourceArea: activeResources(5) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectFailure(
      p1.deployUnit(gd01PerfectStrikeGundam068, { targets: [enemyId] }),
      "INVALID_TARGET",
    );

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getCardZone(enemyId)).toBe(`battleArea:${PLAYER_TWO}`);
  });
});
