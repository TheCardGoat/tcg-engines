import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03GundamNt1FullArmor007 } from "./007-gundam-nt-1-full-armor.ts";

describe("Gundam NT-1 Full Armor (GD03-007)", () => {
  it("【Destroyed】 rests an enemy Unit with 3 or less HP", () => {
    const enemy = createMockUnit({ hp: 3 });
    const attacker = createMockUnit({ ap: 4, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [{ card: gd03GundamNt1FullArmor007, exhausted: true }] },
      { play: [attacker, enemy] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const [attackerId, enemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p2.enterBattle(attackerId, unitId!));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [enemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p1.getCardZone(unitId!)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.isExhausted(enemyId!)).toBe(true);
  });

  it("does not offer an enemy Unit with more than 3 HP after it is destroyed", () => {
    const sturdyEnemy = createMockUnit({ hp: 4 });
    const attacker = createMockUnit({ ap: 4, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [{ card: gd03GundamNt1FullArmor007, exhausted: true }] },
      { play: [attacker, sturdyEnemy] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const [attackerId, sturdyEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p2.enterBattle(attackerId!, unitId));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.isExhausted(sturdyEnemyId!)).toBe(false);
  });
});
