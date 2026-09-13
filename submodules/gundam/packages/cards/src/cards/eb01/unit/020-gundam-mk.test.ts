import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { eb01GundamMk020 } from "./020-gundam-mk.ts";

describe("Gundam Mk-II (EB01-020)", () => {
  it("【During Link】【Activate･Action】 heals exactly 1 damage from any chosen Unit", () => {
    const pilot = createMockPilot({ traits: ["durability"] });
    const enemy = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [{ card: eb01GundamMk020, damage: 2 }],
        resourceArea: activeResources(1),
      },
      { play: [{ card: enemy, damage: 2 }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(pilot, sourceId));
    expectSuccess(p1.enterBattle(sourceId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());

    expectSuccess(p1.activateAbility(sourceId, 0));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([sourceId, enemyId]),
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.getDamage(enemyId)).toBe(1);
    expect(p1.getDamage(sourceId)).toBe(2);
  });

  it("requires a Link Unit and cannot be used twice in the same turn", () => {
    const pilot = createMockPilot({ traits: ["durability"] });
    const target = createMockUnit({ hp: 4 });
    const unlinkedEngine = GundamTestEngine.create({ play: [eb01GundamMk020] }, { play: [target] });
    const unlinkedP1 = unlinkedEngine.asPlayer(PLAYER_ONE);
    const unlinkedP2 = unlinkedEngine.asPlayer(PLAYER_TWO);
    const unlinkedSourceId = unlinkedP1.getCardsInZone("battleArea")[0]!;

    expectSuccess(unlinkedP1.enterBattle(unlinkedSourceId, "direct"));
    expectSuccess(unlinkedP2.passBlock());
    expectSuccess(unlinkedP2.passBattleAction());
    expectFailure(unlinkedP1.activateAbility(unlinkedSourceId, 0), "CONDITIONS_NOT_MET");

    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [eb01GundamMk020, target],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [sourceId, targetId] = p1.getCardsInZone("battleArea");
    expectSuccess(p1.assignPilot(pilot, sourceId!));
    expectSuccess(p1.enterBattle(sourceId!, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.activateAbility(sourceId!, 0));
    expectSuccess(p1.resolveEffect({ targets: [targetId!] }));
    expectSuccess(p2.passBattleAction());
    expectFailure(p1.activateAbility(sourceId!, 0), "ABILITY_LIMIT_REACHED");
  });
});
