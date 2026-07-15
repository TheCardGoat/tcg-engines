import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st07LockonStratosNeil011 } from "./011-lockon-stratos-neil.ts";

describe("Lockon Stratos (Neil) (ST07-011)", () => {
  it("【Burst】Add this card to your hand.", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [st07LockonStratosNeil011] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const shieldId = p2.getCardsInZone("shieldArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: shieldId,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getHand()).toContain(shieldId);
  });

  it("【When Paired】lets the paired CB Unit attack an active enemy Unit at its Lv. or lower", () => {
    const host = createMockUnit({ traits: ["cb"], level: 4, hp: 5 });
    const eligibleEnemy = createMockUnit({ name: "Eligible Enemy", level: 4, hp: 5 });
    const highLevelEnemy = createMockUnit({ name: "High-Level Enemy", level: 5, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [st07LockonStratosNeil011],
        play: [host],
        resourceArea: activeResources(4),
      },
      { play: [eligibleEnemy, highLevelEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const [eligibleEnemyId, highLevelEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(st07LockonStratosNeil011, hostId));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([hostId]),
    });
    expectSuccess(p1.resolveEffect({ targets: [hostId] }));

    expect(p1.getLegalAttackTargets(hostId)).toContain(eligibleEnemyId);
    expect(p1.getLegalAttackTargets(hostId)).not.toContain(highLevelEnemyId);
    expectSuccess(p1.enterBattle(hostId, eligibleEnemyId!));
  });
});
