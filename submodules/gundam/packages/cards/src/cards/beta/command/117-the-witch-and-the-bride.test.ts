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
import { betaTheWitchAndTheBride117 } from "./117-the-witch-and-the-bride.ts";
describe("The Witch and the Bride (GD01-117, beta reprint)", () => {
  it("【Burst】Activate this card's 【Main】 — returns an HP ≤ 5 enemy Unit to hand.", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 3, hp: 5 });
    const engine = GundamTestEngine.create(
      { shieldArea: [betaTheWitchAndTheBride117] },
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

    expect(p2.getCardZone(attackerId)).toBe(`hand:${PLAYER_TWO}`);
  });

  describe("【Main】/【Action】Choose 1 enemy Unit with 5 or less HP. Return it to its owner's hand.", () => {
    it("bounces an HP ≤ 5 enemy unit back to its owner's hand", () => {
      const enemy = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [betaTheWitchAndTheBride117],
          resourceArea: activeResources(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(betaTheWitchAndTheBride117, { targets: [enemyId!] }));

      expect(p2.getCardZone(enemyId!)).toBe(`hand:${PLAYER_TWO}`);
      expect(p1.getCardZone(cmdId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("cannot target an enemy unit with more than 5 HP", () => {
      const tough = createMockUnit({ ap: 5, hp: 8 });
      const engine = GundamTestEngine.create(
        {
          hand: [betaTheWitchAndTheBride117],
          resourceArea: activeResources(5),
        },
        { play: [tough] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [toughId] = p2.getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(betaTheWitchAndTheBride117, { targets: [toughId!] }),
        "INVALID_TARGET",
      );
    });
  });
});
