import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st06ClanBattle014 } from "./014-clan-battle.ts";

function clanLinkUnit() {
  return createMockUnit({ traits: ["clan"], linkCondition: "[Link Pilot]", ap: 2, hp: 5 });
}

describe("Clan Battle (ST06-014)", () => {
  describe("Printed Lv.3 and cost 1", () => {
    it("deploys to the Base Section for one active Resource", () => {
      const engine = GundamTestEngine.create({
        hand: [st06ClanBattle014],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectSuccess(p1.deployBase(cardId));

      expect(p1.getCardZone(cardId)).toBe(`baseSection:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(1);
    });

    it("rejects deployment below Lv.3", () => {
      const engine = GundamTestEngine.create({
        hand: [st06ClanBattle014],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployBase(st06ClanBattle014), "INSUFFICIENT_RESOURCE_LEVEL");
    });
  });

  describe("【Deploy】Add 1 of your Shields to your hand.", () => {
    it("moves one visible Shield to hand when deployed", () => {
      const shield = createMockUnit({ name: "Shield" });
      const engine = GundamTestEngine.create({
        hand: [st06ClanBattle014],
        shieldArea: [shield],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const handBefore = p1.getHand().length;

      expectSuccess(p1.deployBase(st06ClanBattle014));

      expect(p1.getHand()).toHaveLength(handBefore);
      expect(p1.getCardsInZone("shieldArea")).toHaveLength(0);
    });
  });

  describe("【Burst】Deploy this card.", () => {
    it("deploys from Shield and then resolves its Deploy ability", () => {
      const attacker = createMockUnit({ ap: 1, hp: 5 });
      const otherShield = createMockUnit({ name: "Other Shield" });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st06ClanBattle014, otherShield] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected the visible Burst choice");
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));

      expect(p2.getCardZone(burst.sourceCardId)).toBe(`baseSection:${PLAYER_TWO}`);
      expect(p2.getCardsInZone("shieldArea")).toHaveLength(0);
      expect(p2.getHand()).toHaveLength(1);
    });
  });

  describe("【Activate･Main】Rest this Base：If a friendly (Clan) Link Unit is in play, choose 1 friendly Unit. It gets AP+2 during this turn.", () => {
    it("rests the Base and gives only the chosen Unit AP+2 when a Clan Link Unit is in play", () => {
      const pilot = createMockPilot({
        name: "Link Pilot",
        level: 1,
        cost: 0,
        apBonus: 0,
        hpBonus: 0,
      });
      const target = createMockUnit({ name: "Target", ap: 2, hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [pilot],
        baseSection: [st06ClanBattle014],
        play: [clanLinkUnit(), target],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [linkId, targetId] = p1.getCardsInZone("battleArea");
      const baseId = p1.getCardsInZone("baseSection")[0]!;
      expectSuccess(p1.assignPilot(pilot, linkId!));

      expectSuccess(p1.activateBaseAbility(baseId, { targets: [targetId!] }));

      expect(p1.isExhausted(baseId)).toBe(true);
      expect(p1.getVisibleCard(targetId!)?.effectiveAp).toBe(4);
      expect(p1.getVisibleCard(linkId!)?.effectiveAp).toBe(2);
    });

    it("cannot activate when the friendly Clan Unit is not linked", () => {
      const target = createMockUnit({ name: "Target", ap: 2, hp: 5 });
      const engine = GundamTestEngine.create({
        baseSection: [st06ClanBattle014],
        play: [clanLinkUnit(), target],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const baseId = p1.getCardsInZone("baseSection")[0]!;
      const targetId = p1.getCardsInZone("battleArea")[1]!;

      expectFailure(p1.activateBaseAbility(baseId, { targets: [targetId] }), "CONDITIONS_NOT_MET");
      expect(p1.isExhausted(baseId)).toBe(false);
      expect(p1.getVisibleCard(targetId)?.effectiveAp).toBe(2);
    });
  });
});
