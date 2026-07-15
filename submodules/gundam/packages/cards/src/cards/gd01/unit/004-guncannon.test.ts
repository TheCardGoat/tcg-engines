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
import { gd01Guncannon004 } from "./004-guncannon.ts";
import {
  passTurnThroughPublicMoves,
  resolveUnitBattle,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Guncannon (GD01-004)", () => {
  it("recovers 1 HP at the end of its controller's turn", () => {
    const defender = createMockUnit({ ap: 2, hp: 10 });
    const engine = GundamTestEngine.create(
      { play: [gd01Guncannon004], shieldArea: [createMockUnit()], deck: 5 },
      { play: [defender], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const guncannonId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [defenderId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    resolveUnitBattle(engine, PLAYER_ONE, guncannonId, defenderId);
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getDamage(guncannonId)).toBe(1);
  });

  it("lets the player choose an enemy Unit with 2 or less HP to rest when paired", () => {
    const whiteBasePilot = createMockPilot({ traits: ["white base team"], level: 1, cost: 1 });
    const legalEnemy = createMockUnit({ hp: 2 });
    const tooLarge = createMockUnit({ hp: 3 });
    const friendly = createMockUnit({ hp: 2 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01Guncannon004, whiteBasePilot],
        play: [friendly],
        resourceArea: activeResources(3),
      },
      { play: [legalEnemy, tooLarge] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [legalEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd01Guncannon004));
    const guncannonId = p1.getCardsInZone("battleArea")[1]!;
    expectSuccess(p1.assignPilot(whiteBasePilot, guncannonId));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [legalEnemyId],
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [legalEnemyId!] }));

    expect(p2.isExhausted(legalEnemyId!)).toBe(true);
    expectSuccess(p1.enterBattle(guncannonId, legalEnemyId!));
  });

  it("does not offer a target when every enemy Unit has more than 2 HP", () => {
    const pilot = createMockPilot({ level: 1, cost: 1 });
    const enemy = createMockUnit({ hp: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd01Guncannon004],
        resourceArea: activeResources(3),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, gd01Guncannon004));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.isExhausted(enemyId)).toBe(false);
  });
});
