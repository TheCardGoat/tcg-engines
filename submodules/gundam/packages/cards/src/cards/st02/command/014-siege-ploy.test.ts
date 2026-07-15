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
import { st02SiegePloy014 } from "./014-siege-ploy.ts";
describe("Siege Ploy (ST02-014)", () => {
  it("【Burst】Activate this card's 【Main】 — rests an HP ≤ 5 enemy Unit.", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 3, hp: 4 });
    const engine = GundamTestEngine.create(
      { shieldArea: [st02SiegePloy014] },
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

    expect(p2.isExhausted(attackerId)).toBe(true);
    expect(p1.getCardZone(shieldId)).toBe(`trash:${PLAYER_ONE}`);
  });

  describe("【Main】/【Action】Choose 1 enemy Unit with 5 or less HP. Rest it.", () => {
    it("rests an enemy unit whose HP ≤ 5", () => {
      const enemy = createMockUnit({ ap: 3, hp: 4 });
      const engine = GundamTestEngine.create(
        { hand: [st02SiegePloy014], resourceArea: activeResources(3) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(st02SiegePloy014, { targets: [enemyId!] }));

      expect(p2.isExhausted(enemyId!)).toBe(true);
      expect(p1.getCardZone(cmdId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("cannot target an enemy unit with more than 5 HP", () => {
      const tough = createMockUnit({ ap: 5, hp: 8 });
      const engine = GundamTestEngine.create(
        { hand: [st02SiegePloy014], resourceArea: activeResources(3) },
        { play: [tough] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [toughId] = p2.getCardsInZone("battleArea");

      expectFailure(p1.playCommand(st02SiegePloy014, { targets: [toughId!] }), "INVALID_TARGET");
    });
  });
});
