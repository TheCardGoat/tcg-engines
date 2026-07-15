import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st05GundamGusionRebake005 } from "./005-gundam-gusion-rebake.ts";

describe("Gundam Gusion Rebake (ST05-005)", () => {
  it("【Destroyed】 rests an enemy Unit with 4 or less AP when killed in combat", () => {
    const bigAttacker = createMockUnit({ ap: 5, hp: 5 });
    const weakEnemy = createMockUnit({ ap: 2, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [bigAttacker, weakEnemy] },
      { play: [{ card: st05GundamGusionRebake005, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [bigAttackerId, weakEnemyId] = p1.getCardsInZone("battleArea");
    const gusionId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(bigAttackerId!, gusionId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      sourceCardId: gusionId,
      legalTargetIds: [weakEnemyId],
    });
    expectSuccess(p2.resolveEffect({ targets: [weakEnemyId!] }));

    expect(p2.getCardZone(gusionId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p1.isExhausted(weakEnemyId!)).toBe(true);
  });
});
