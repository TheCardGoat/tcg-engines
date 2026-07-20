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
import { st02CorsicaBase016 } from "./016-corsica-base.ts";

describe("Corsica Base (ST02-016)", () => {
  describe("【Burst】Deploy this card.", () => {
    it("deploys the revealed Shield into its owner's Base section", () => {
      const attacker = createMockUnit({ ap: 1, hp: 4 });
      const otherShield = createMockUnit({ name: "Other Shield" });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st02CorsicaBase016, otherShield] },
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
      expect(burst).toMatchObject({
        controllerId: PLAYER_TWO,
        prompt: "【Burst】Deploy this card.",
      });
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));

      expect(p2.getCardZone(st02CorsicaBase016)).toBe(`baseSection:${PLAYER_TWO}`);
      expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(0);
      expect(p2.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("moves the revealed Shield to trash when its owner declines", () => {
      const attacker = createMockUnit({ ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st02CorsicaBase016] },
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
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: false } }));

      expect(p2.getCardZone(st02CorsicaBase016)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getCardsInZone("baseSection")).toHaveLength(0);
    });
  });

  describe('【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn, deploy 1 [Tallgeese]((OZ)·AP4·HP2) Unit token. If it is your turn and a card with "Corsica Base" in its card name is in your trash, deploy 2 [Leo]((OZ)·AP1·HP1) Unit tokens instead.', () => {
    it("adds one Shield to hand and deploys an active Tallgeese token on its controller's turn", () => {
      const shield = createMockUnit({ name: "Returned Shield" });
      const engine = GundamTestEngine.create({
        hand: [st02CorsicaBase016],
        shieldArea: [shield],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployBase(st02CorsicaBase016));

      expect(p1.getCardZone(shield)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getCardZone(st02CorsicaBase016)).toBe(`baseSection:${PLAYER_ONE}`);
      const tokenId = p1.getCardsInZone("battleArea")[0]!;
      expect(p1.getVisibleCard(tokenId)).toMatchObject({
        effectiveAp: 4,
        effectiveHp: 2,
        exhausted: false,
      });
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(3);
    });

    it("deploys the Tallgeese token even when there is no Shield to add", () => {
      const engine = GundamTestEngine.create({
        hand: [st02CorsicaBase016],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployBase(st02CorsicaBase016));

      expect(p1.getBoardView().players[PLAYER_ONE]?.shieldCount).toBe(0);
      const tokenId = p1.getCardsInZone("battleArea")[0]!;
      expect(p1.getVisibleCard(tokenId)).toMatchObject({ effectiveAp: 4, effectiveHp: 2 });
    });

    it("deploys two active Leo tokens instead when Corsica Base is already in its trash", () => {
      const engine = GundamTestEngine.create({
        hand: [st02CorsicaBase016],
        trash: [st02CorsicaBase016],
        shieldArea: [createMockUnit({ name: "Shield" })],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployBase(st02CorsicaBase016));

      const tokenIds = p1.getCardsInZone("battleArea");
      expect(tokenIds).toHaveLength(2);
      expect(tokenIds.map((id) => p1.getVisibleCard(id))).toEqual([
        expect.objectContaining({ effectiveAp: 1, effectiveHp: 1, exhausted: false }),
        expect.objectContaining({ effectiveAp: 1, effectiveHp: 1, exhausted: false }),
      ]);
    });

    it("does not deploy both Tallgeese and Leo tokens in the replacement branch", () => {
      const engine = GundamTestEngine.create({
        hand: [st02CorsicaBase016],
        trash: [st02CorsicaBase016],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployBase(st02CorsicaBase016));

      const visibleUnits = p1.getCardsInZone("battleArea").map((id) => p1.getVisibleCard(id));
      expect(visibleUnits).toHaveLength(2);
      expect(visibleUnits.every((card) => card?.effectiveAp === 1 && card.effectiveHp === 1)).toBe(
        true,
      );
    });

    it("cannot be deployed below its printed Lv.3", () => {
      const engine = GundamTestEngine.create({
        hand: [st02CorsicaBase016],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployBase(st02CorsicaBase016), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(st02CorsicaBase016)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pay its printed cost without three active Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st02CorsicaBase016],
        resourceArea: activeResources(3).map((entry, index) => ({
          ...entry,
          exhausted: index === 2,
        })),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployBase(st02CorsicaBase016), "INSUFFICIENT_RESOURCES");
      expect(p1.getCardZone(st02CorsicaBase016)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });
  });
});
