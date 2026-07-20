import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { st03Falmel016 } from "./016-falmel.ts";

describe("Falmel (ST03-016)", () => {
  describe("【Burst】Deploy this card.", () => {
    it("deploys the revealed Base and adds another Shield to hand without creating a token on the opponent's turn", () => {
      const attacker = createMockUnit({ ap: 1, hp: 5 });
      const otherShield = createMockUnit({ name: "Other Shield" });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st03Falmel016, otherShield] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Falmel's Burst choice");
      const baseId = burst.sourceCardId;
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));

      expect(p2.getCardZone(baseId)).toBe(`baseSection:${PLAYER_TWO}`);
      expect(p2.getBoardView().players[PLAYER_TWO]!.shieldCount).toBe(0);
      expect(p2.getHand()).toHaveLength(1);
      expect(p2.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("moves the revealed Base to trash when its owner declines Burst", () => {
      const attacker = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create({ play: [attacker] }, { shieldArea: [st03Falmel016] });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Falmel's Burst choice");
      const baseId = burst.sourceCardId;
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: false } }));

      expect(p2.getCardZone(baseId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getCardsInZone("baseSection")).toHaveLength(0);
    });
  });

  describe("【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn, deploy 1 rested [Char's Zaku Ⅱ]((Zeon)･AP3･HP1) Unit token.", () => {
    it("adds exactly one Shield and deploys one rested AP3/HP1 token during its controller's turn", () => {
      const shield = createMockUnit({ name: "Returned Shield" });
      const engine = GundamTestEngine.create({
        hand: [st03Falmel016],
        shieldArea: [shield],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const baseId = p1.getHand()[0]!;
      const handCountBefore = p1.getHand().length;

      expectSuccess(p1.deployBase(baseId));

      const tokenId = p1.getCardsInZone("battleArea")[0]!;
      expect(p1.getCardZone(baseId)).toBe(`baseSection:${PLAYER_ONE}`);
      expect(p1.getHand()).toHaveLength(handCountBefore);
      expect(p1.getVisibleCard(tokenId)).toMatchObject({
        effectiveAp: 3,
        effectiveHp: 1,
        exhausted: true,
      });
    });

    it("deploys exactly one token", () => {
      const existing = createMockUnit({ name: "Existing Unit" });
      const engine = GundamTestEngine.create({
        hand: [st03Falmel016],
        play: [existing],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const before = p1.getCardsInZone("battleArea");

      expectSuccess(p1.deployBase(st03Falmel016));

      const after = p1.getCardsInZone("battleArea");
      expect(after).toHaveLength(before.length + 1);
      const tokenId = after.find((id) => !before.includes(id));
      expect(tokenId).toBeDefined();
      expect(p1.isExhausted(tokenId!)).toBe(true);
    });

    it("still deploys the rested token when there is no Shield to add to hand", () => {
      const engine = GundamTestEngine.create({
        hand: [st03Falmel016],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployBase(st03Falmel016));

      const tokenId = p1.getCardsInZone("battleArea")[0]!;
      expect(p1.getVisibleCard(tokenId)).toMatchObject({
        effectiveAp: 3,
        effectiveHp: 1,
        exhausted: true,
      });
      expect(p1.getHand()).toHaveLength(0);
    });

    it("cannot be deployed below its printed Lv.3 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [st03Falmel016],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployBase(st03Falmel016), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(st03Falmel016)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot pay its printed cost without two active Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st03Falmel016],
        resourceArea: restedResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployBase(st03Falmel016), "INSUFFICIENT_RESOURCES");
      expect(p1.getCardZone(st03Falmel016)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot be deployed by the standby player during the opponent's Main Phase", () => {
      const engine = GundamTestEngine.create(
        { hand: [st03Falmel016], resourceArea: activeResources(3) },
        {},
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployBase(st03Falmel016), "NOT_ACTIVE_PLAYER");
      expect(p1.getCardZone(st03Falmel016)).toBe(`hand:${PLAYER_ONE}`);
    });

    // The effect has no chosen target, owner filter, or decline branch beyond its Burst choice.
  });
});
