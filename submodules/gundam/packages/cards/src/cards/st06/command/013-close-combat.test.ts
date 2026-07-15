import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  createMockUnit,
  activeResources,
} from "@tcg/gundam-engine";
import { st06CloseCombat013 } from "./013-close-combat.ts";
describe("Close Combat (ST03-013-p3 / ST06 reprint)", () => {
  it("【Burst】Activate this card's 【Main】 — deals 2 damage to an enemy Unit.", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 3, hp: 5 });
    const engine = GundamTestEngine.create(
      { shieldArea: [st06CloseCombat013] },
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

    expect(p2.getDamage(attackerId)).toBe(2);
    expect(p1.getCardZone(shieldId)).toBe(`trash:${PLAYER_ONE}`);
  });

  describe("【Main】/【Action】Choose 1 enemy Unit. Deal 2 damage to it.", () => {
    it("deals 2 damage to the chosen enemy unit", () => {
      const enemy = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st06CloseCombat013], resourceArea: activeResources(2) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(st06CloseCombat013, { targets: [enemyId!] }));

      expect(p2.getDamage(enemyId!)).toBe(2);
      expect(p1.getCardZone(cmdId)).toBe(`trash:${PLAYER_ONE}`);
    });
  });
});
