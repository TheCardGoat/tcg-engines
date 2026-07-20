import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04SoEwin081 } from "./081-so-ewin.ts";

describe("Üso Ewin (GD04-081)", () => {
  it("【Burst】adds this card to hand when its controller accepts the revealed Shield prompt", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd04SoEwin081] },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: expect.any(String),
      directiveIndex: -1,
    });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p1.getHand()).toHaveLength(1);
  });

  describe("【When Paired】If this is a (League Militaire) Unit, deploy 1 [Parts]((League Militaire)･AP1･HP1･This Unit can't choose the enemy player as its attack target) Unit token.", () => {
    it("deploys the active Parts token when paired with a League Militaire Unit", () => {
      const host = createMockUnit({ traits: ["league militaire"] });
      const engine = GundamTestEngine.create({
        hand: [gd04SoEwin081],
        play: [host],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const battleAreaBefore = p1.getCardsInZone("battleArea");
      const hostId = battleAreaBefore[0]!;
      const pilotId = p1.getHand()[0]!;

      expectSuccess(p1.assignPilot(gd04SoEwin081, hostId));

      const partsId = p1
        .getCardsInZone("battleArea")
        .find((cardId) => !battleAreaBefore.includes(cardId) && cardId !== pilotId);
      expect(partsId).toBeDefined();
      expect(p1.isExhausted(partsId!)).toBe(false);
      expect(p1.getVisibleCard(partsId!)).toMatchObject({
        effectiveAp: 1,
        effectiveHp: 1,
        restrictions: ["cannot-target-player"],
      });
      expect(p1.getLegalAttackTargets(partsId!)).not.toContain("direct");
    });

    it("does not deploy a Parts token when the paired Unit is not League Militaire", () => {
      const host = createMockUnit({ traits: ["earth federation"] });
      const engine = GundamTestEngine.create({
        hand: [gd04SoEwin081],
        play: [host],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const battleAreaBefore = p1.getCardsInZone("battleArea");
      const pilotId = p1.getHand()[0]!;

      expectSuccess(p1.assignPilot(gd04SoEwin081, host));

      expect(
        p1
          .getCardsInZone("battleArea")
          .filter((cardId) => !battleAreaBefore.includes(cardId) && cardId !== pilotId),
      ).toHaveLength(0);
    });
  });
});
