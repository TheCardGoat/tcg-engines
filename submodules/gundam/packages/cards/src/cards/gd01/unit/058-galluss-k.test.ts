import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01GallussK058 } from "./058-galluss-k.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Galluss-K (GD01-058)", () => {
  it("offers any Lv.4 or higher Unit during an Action Step and gives the chosen Unit AP+1 for the battle", () => {
    const attacker = createMockUnit({ ap: 1, hp: 6, level: 3 });
    const eligibleEnemy = createMockUnit({ ap: 4, hp: 8, level: 4 });
    const lowLevelEnemy = createMockUnit({ ap: 4, hp: 8, level: 3 });
    const engine = GundamTestEngine.create(
      {
        deck: 2,
        play: [gd01GallussK058, attacker],
        resourceArea: activeResources(2),
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      { play: [eligibleEnemy, lowLevelEnemy] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [gallussId, attackerId] = p1.getCardsInZone("battleArea");
    const [eligibleEnemyId, lowLevelEnemyId] = p2.getCardsInZone("battleArea");

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [eligibleEnemyId!]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);

    expectSuccess(p1.enterBattle(attackerId!, eligibleEnemyId!));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(2);
    expectSuccess(p1.activateAbility(gallussId!, 0));

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([eligibleEnemyId]),
      minTargets: 1,
      maxTargets: 1,
    });
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") throw new Error("Expected a visible target choice");
    expect(choice.legalTargetIds).not.toContain(lowLevelEnemyId);
    expectSuccess(p1.resolveEffect({ targets: [eligibleEnemyId!] }));

    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(1);
    expect(p2.getVisibleCard(eligibleEnemyId!)?.effectiveAp).toBe(5);
    expectSuccess(p2.passBattleAction());
    expectFailure(p1.activateAbility(gallussId!, 0), "ABILITY_LIMIT_REACHED");
    expectSuccess(p1.passBattleAction());
    expect(p2.getVisibleCard(eligibleEnemyId!)?.effectiveAp).toBe(4);
  });

  it("cannot activate during the Main Phase", () => {
    const eligibleEnemy = createMockUnit({ level: 4 });
    const engine = GundamTestEngine.create(
      { play: [gd01GallussK058], resourceArea: activeResources(1) },
      { play: [eligibleEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const gallussId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectFailure(p1.activateAbility(gallussId, 0, { targets: [enemyId] }), "WRONG_PHASE");

    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(2);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });
});
