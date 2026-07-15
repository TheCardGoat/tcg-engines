import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  expectFailure,
  createMockUnit,
  activeResources,
} from "@tcg/gundam-engine";
import { st05FatalStrike014 } from "./014-fatal-strike.ts";
describe("Fatal Strike (ST05-014)", () => {
  it("【Burst】Choose 1 enemy Unit. Deal 1 damage to it.", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 3, hp: 5 });
    const engine = GundamTestEngine.create(
      { shieldArea: [st05FatalStrike014] },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const shieldId = p1.getCardsInZone("shieldArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: shieldId,
      directiveIndex: -1,
    });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      sourceCardId: shieldId,
      legalTargetIds: [attackerId],
    });
    expectSuccess(p1.resolveEffect({ targets: [attackerId] }));

    expect(p2.getDamage(attackerId)).toBe(1);
    expect(p1.getCardZone(shieldId)).toBe(`trash:${PLAYER_ONE}`);
  });

  describe("【Main】Choose 1 enemy Unit that is Lv.3 or lower. Destroy it.", () => {
    it("destroys a Lv.3 or lower enemy unit", () => {
      const lowLevelEnemy = createMockUnit({ level: 3, ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st05FatalStrike014], resourceArea: activeResources(4) },
        { play: [lowLevelEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(st05FatalStrike014, { targets: [enemyId!] }));

      expect(p2.getCardZone(enemyId!)).toBe(`trash:${PLAYER_TWO}`);
      expect(p1.getCardZone(cmdId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("cannot target an enemy unit with Lv > 3", () => {
      const bigEnemy = createMockUnit({ level: 5, ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st05FatalStrike014], resourceArea: activeResources(4) },
        { play: [bigEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectFailure(p1.playCommand(st05FatalStrike014, { targets: [enemyId!] }), "INVALID_TARGET");
    });
  });
});
