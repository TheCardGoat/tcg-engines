import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04SleggarLaw084 } from "./084-sleggar-law.ts";

describe("Sleggar Law (GD04-084)", () => {
  it("【Burst】adds this card to hand when its controller accepts the revealed Shield prompt", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd04SleggarLaw084] },
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

    expect(p1.getHand()).toContain(shieldId);
  });

  describe("【Attack】Choose 1 of your (White Base Team) Units. It gets AP+1 during this turn.", () => {
    it("increases the chosen White Base Team Unit's battle damage by 1", () => {
      const host = createMockUnit({
        name: "White Base Team Host",
        traits: ["white base team"],
        ap: 2,
        linkCondition: "[Sleggar Law]",
      });
      const enemy = createMockUnit({ name: "Enemy Defender", ap: 0, hp: 8 });
      const engine = GundamTestEngine.create(
        { hand: [gd04SleggarLaw084], play: [host], resourceArea: activeResources(3) },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd04SleggarLaw084, hostId));
      expectSuccess(p1.enterBattle(hostId, enemyId));
      expectSuccess(p1.resolveEffect({ targets: [hostId] }));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getDamage(enemyId)).toBe(4);
    });

    it("rejects a friendly Unit without the White Base Team trait", () => {
      const host = createMockUnit({
        name: "White Base Team Host",
        traits: ["white base team"],
        linkCondition: "[Sleggar Law]",
      });
      const nonWhiteBaseTeam = createMockUnit({ name: "Other Friendly Unit", traits: ["zeon"] });
      const enemy = createMockUnit({ name: "Enemy Defender", ap: 0, hp: 8 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04SleggarLaw084],
          play: [host, nonWhiteBaseTeam],
          resourceArea: activeResources(3),
        },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [hostId, nonWhiteBaseTeamId] = p1.getCardsInZone("battleArea");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd04SleggarLaw084, hostId!));
      expectSuccess(p1.enterBattle(hostId!, enemyId));

      expectFailure(p1.resolveEffect({ targets: [nonWhiteBaseTeamId!] }), "ILLEGAL_TARGET");
    });
  });
});
