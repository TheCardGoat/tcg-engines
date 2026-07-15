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
import { gd01CagalliSSkygrasper080 } from "./080-cagalli-s-skygrasper.ts";
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

describe("Cagalli's Skygrasper (GD01-080)", () => {
  it("offers a Lv.2-or-lower enemy Unit after it is destroyed and returns the choice to hand", () => {
    const attacker = createMockUnit({ ap: 2, hp: 5, level: 5 });
    const eligibleEnemy = createMockUnit({ hp: 5, level: 1 });
    const engine = GundamTestEngine.create(
      {
        deck: 2,
        play: [attacker, eligibleEnemy],
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      { play: [gd01CagalliSSkygrasper080] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [attackerId, eligibleEnemyId] = p1.getCardsInZone("battleArea");
    const cagalliId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [cagalliId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);

    expectSuccess(p1.enterBattle(attackerId!, cagalliId));
    completeBattle(p1, p2);

    expect(p2.getCardZone(cagalliId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [eligibleEnemyId],
    });
    expectSuccess(p2.resolveEffect({ targets: [eligibleEnemyId!] }));

    expect(p1.getCardZone(eligibleEnemyId!)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(attackerId!)).toBe(`battleArea:${PLAYER_ONE}`);
  });

  it("links with Cagalli Yula Athha and can attack on the deployment turn", () => {
    const cagalli = createMockPilot({ name: "Cagalli Yula Athha", level: 1, cost: 1 });
    const enemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01CagalliSSkygrasper080, cagalli],
        deck: 2,
        resourceArea: activeResources(3),
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      { play: [enemy] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);

    expectSuccess(p1.deployUnit(gd01CagalliSSkygrasper080));
    const skygrasperId = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(cagalli, skygrasperId));

    expectSuccess(p1.enterBattle(skygrasperId, enemyId));
  });
});
