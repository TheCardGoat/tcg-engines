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
import { gd01GundamPharact071 } from "./071-gundam-pharact.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

function completeBattle(
  attacker: ReturnType<GundamTestEngine["asPlayer"]>,
  defender: ReturnType<GundamTestEngine["asPlayer"]>,
) {
  expectSuccess(defender.passBlock());
  expectSuccess(defender.passBattleAction());
  expectSuccess(attacker.passBattleAction());
}

describe("Gundam Pharact (GD01-071)", () => {
  it("links with an Academy Pilot, offers enemy Units on attack, and applies AP-2 for the battle", () => {
    const academyPilot = createMockPilot({ traits: ["academy"], level: 1, cost: 1 });
    const defender = createMockUnit({ ap: 4, hp: 5 });
    const otherEnemy = createMockUnit({ ap: 4, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01GundamPharact071, academyPilot],
        deck: 2,
        resourceArea: activeResources(4),
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      { play: [defender, otherEnemy] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [defenderId, otherEnemyId] = p2.getCardsInZone("battleArea");

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [defenderId!]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);

    expectSuccess(p1.deployUnit(gd01GundamPharact071));
    const pharactId = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(academyPilot, pharactId));
    expectSuccess(p1.enterBattle(pharactId, defenderId!));

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([defenderId, otherEnemyId]),
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [defenderId!] }));
    expect(p2.getVisibleCard(defenderId!)?.effectiveAp).toBe(2);
    expect(p2.getVisibleCard(otherEnemyId!)?.effectiveAp).toBe(4);

    completeBattle(p1, p2);
    expect(p1.getCardZone(pharactId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getDamage(pharactId)).toBe(2);
    expect(p2.getVisibleCard(defenderId!)?.effectiveAp).toBe(4);
  });

  it("does not offer the AP reduction while paired with a non-Academy Pilot", () => {
    const wrongPilot = createMockPilot({ traits: ["zaft"], level: 1, cost: 1 });
    const defender = createMockUnit({ ap: 4, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [wrongPilot],
        deck: 2,
        play: [gd01GundamPharact071],
        resourceArea: activeResources(1),
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      { play: [defender] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const pharactId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [defenderId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);

    expectSuccess(p1.assignPilot(wrongPilot, pharactId));
    expectSuccess(p1.enterBattle(pharactId, defenderId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getVisibleCard(defenderId)?.effectiveAp).toBe(4);
  });
});
