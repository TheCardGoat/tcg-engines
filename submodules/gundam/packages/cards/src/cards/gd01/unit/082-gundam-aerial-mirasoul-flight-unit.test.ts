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
import { gd01GundamAerialMirasoulFlightUnit082 } from "./082-gundam-aerial-mirasoul-flight-unit.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Gundam Aerial (Mirasoul Flight Unit) (GD01-082)", () => {
  it("links with Suletta, reaches the Action Step, and gives the chosen enemy AP-1 for the battle", () => {
    const suletta = createMockPilot({ name: "Suletta Mercury", level: 1, cost: 1 });
    const defender = createMockUnit({ ap: 3, hp: 6 });
    const otherEnemy = createMockUnit({ ap: 3, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01GundamAerialMirasoulFlightUnit082, suletta],
        deck: 2,
        resourceArea: activeResources(8),
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

    expectSuccess(p1.deployUnit(gd01GundamAerialMirasoulFlightUnit082));
    const aerialId = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(suletta, aerialId));
    expectSuccess(p1.enterBattle(aerialId, defenderId!));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(4);
    expectSuccess(p1.activateAbility(aerialId, 0));

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([defenderId, otherEnemyId]),
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [defenderId!] }));

    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(2);
    expect(p2.getVisibleCard(defenderId!)?.effectiveAp).toBe(2);
    expect(p2.getVisibleCard(otherEnemyId!)?.effectiveAp).toBe(3);
    expectSuccess(p2.passBattleAction());
    expectFailure(p1.activateAbility(aerialId, 0), "ABILITY_LIMIT_REACHED");
    expectSuccess(p1.passBattleAction());
    expect(p2.getVisibleCard(defenderId!)?.effectiveAp).toBe(3);
  });

  it("cannot activate during the Main Phase", () => {
    const enemy = createMockUnit({ ap: 3, hp: 6 });
    const engine = GundamTestEngine.create(
      { play: [gd01GundamAerialMirasoulFlightUnit082], resourceArea: activeResources(2) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const aerialId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectFailure(p1.activateAbility(aerialId, 0, { targets: [enemyId] }), "WRONG_PHASE");

    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(3);
  });

  it("cannot activate during an Action Step while it is unpaired", () => {
    const enemy = createMockUnit({ ap: 3, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        deck: 2,
        play: [gd01GundamAerialMirasoulFlightUnit082],
        resourceArea: activeResources(2),
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      { play: [enemy] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const aerialId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.enterBattle(aerialId, enemyId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());

    expectFailure(p1.activateAbility(aerialId, 0), "CONDITIONS_NOT_MET");

    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(0);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(3);
    expectSuccess(p1.passBattleAction());
  });
});
