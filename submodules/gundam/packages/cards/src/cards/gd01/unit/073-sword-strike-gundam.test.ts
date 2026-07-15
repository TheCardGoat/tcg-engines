import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01SwordStrikeGundam073 } from "./073-sword-strike-gundam.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Sword Strike Gundam (GD01-073)", () => {
  it("links with an Earth Alliance Pilot and returns the chosen 2-HP enemy on attack", () => {
    const earthAlliancePilot = createMockPilot({ traits: ["earth alliance"], level: 1, cost: 1 });
    const battleTarget = createMockUnit({ hp: 6 });
    const firstFrailEnemy = createMockUnit({ hp: 2 });
    const secondFrailEnemy = createMockUnit({ hp: 1 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01SwordStrikeGundam073, earthAlliancePilot],
        deck: 2,
        resourceArea: activeResources(4),
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      {
        play: [battleTarget, firstFrailEnemy, secondFrailEnemy],
      },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [battleTargetId, firstFrailId, secondFrailId] = p2.getCardsInZone("battleArea");

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [battleTargetId!]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);

    expectSuccess(p1.deployUnit(gd01SwordStrikeGundam073));
    const swordStrikeId = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(earthAlliancePilot, swordStrikeId));
    expectSuccess(p1.enterBattle(swordStrikeId, battleTargetId!));

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([firstFrailId, secondFrailId]),
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [secondFrailId!] }));

    expect(p2.getCardZone(secondFrailId!)).toBe(`hand:${PLAYER_TWO}`);
    expect(p2.getCardZone(firstFrailId!)).toBe(`battleArea:${PLAYER_TWO}`);
  });

  it("does not offer a return while paired with a Pilot that does not satisfy Link", () => {
    const wrongPilot = createMockPilot({ traits: ["academy"], level: 1, cost: 1 });
    const battleTarget = createMockUnit({ hp: 6 });
    const frailEnemy = createMockUnit({ hp: 2 });
    const engine = GundamTestEngine.create(
      {
        hand: [wrongPilot],
        deck: 2,
        play: [gd01SwordStrikeGundam073],
        resourceArea: activeResources(1),
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      { play: [battleTarget, frailEnemy] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const swordStrikeId = p1.getCardsInZone("battleArea")[0]!;
    const [battleTargetId, frailEnemyId] = p2.getCardsInZone("battleArea");

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [battleTargetId!]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);

    expectSuccess(p1.assignPilot(wrongPilot, swordStrikeId));
    expectSuccess(p1.enterBattle(swordStrikeId, battleTargetId!));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getCardZone(frailEnemyId!)).toBe(`battleArea:${PLAYER_TWO}`);
  });
});
