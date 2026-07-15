import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  createMockUnit,
  activeResources,
} from "@tcg/gundam-engine";
import { st05UnforeseenIncident014 } from "./014-unforeseen-incident.ts";
describe("Unforeseen Incident (ST01-014-p4 / ST05 reprint)", () => {
  it("【Burst】Activate this card's 【Main】 — applies AP-3 to an enemy Unit.", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 5, hp: 4 });
    const engine = GundamTestEngine.create(
      { shieldArea: [st05UnforeseenIncident014] },
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

    expect(p2.getVisibleCard(attackerId)?.effectiveAp).toBe(2);
    expect(p1.getCardZone(shieldId)).toBe(`trash:${PLAYER_ONE}`);
  });

  describe("【Main】/【Action】Choose 1 enemy Unit. It gets AP-3 during this turn.", () => {
    it("applies an AP-3 continuous effect to the targeted enemy", () => {
      const enemy = createMockUnit({ ap: 5, hp: 4 });
      const engine = GundamTestEngine.create(
        { hand: [st05UnforeseenIncident014], resourceArea: activeResources(3) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(st05UnforeseenIncident014, { targets: [enemyId!] }));

      expect(p2.getVisibleCard(enemyId!)?.effectiveAp).toBe(2);
      expect(p1.getCardZone(cmdId)).toBe(`trash:${PLAYER_ONE}`);
    });
  });
});
