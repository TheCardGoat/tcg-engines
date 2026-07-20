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
import { st07Ptolemaios015 } from "./015-ptolemaios.ts";

function attackBase(engine: GundamTestEngine): void {
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  expectSuccess(p2.enterBattle(p2.getCardsInZone("battleArea")[0]!, "direct"));
  expectSuccess(p1.passBlock());
  expectSuccess(p1.passBattleAction());
  expectSuccess(p2.passBattleAction());
}

describe("Ptolemaios (ST07-015)", () => {
  describe("Lv.2 cost 1 HP5 Base and Deploy", () => {
    it("deploys the exact card, pays one Resource, and adds one Shield to hand", () => {
      const engine = GundamTestEngine.create({
        hand: [st07Ptolemaios015],
        resourceArea: activeResources(2),
        shieldArea: [createMockUnit({ name: "Shield" }), createMockUnit({ name: "Other" })],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const baseId = p1.getHand()[0]!;
      const shieldsBefore = p1.getBoardView().players[PLAYER_ONE]!.shieldCount;

      expectSuccess(p1.deployBase(baseId));

      expect(p1.getCardZone(baseId)).toBe(`baseSection:${PLAYER_ONE}`);
      expect(p1.getVisibleCard(baseId)?.effectiveHp).toBe(5);
      expect(p1.getHand()).toHaveLength(1);
      expect(p1.getBoardView().players[PLAYER_ONE]!.shieldCount).toBe(shieldsBefore - 1);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(1);
    });

    it("still deploys cleanly when there is no Shield to add", () => {
      const engine = GundamTestEngine.create({
        hand: [st07Ptolemaios015],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const baseId = p1.getHand()[0]!;
      expectSuccess(p1.deployBase(baseId));
      expect(p1.getCardZone(baseId)).toBe(`baseSection:${PLAYER_ONE}`);
      expect(p1.getHand()).toHaveLength(0);
    });

    it("cannot deploy below Lv.2 or without one active Resource", () => {
      const low = GundamTestEngine.create({
        hand: [st07Ptolemaios015],
        resourceArea: activeResources(1),
      }).asPlayer(PLAYER_ONE);
      expectFailure(low.deployBase(st07Ptolemaios015), "INSUFFICIENT_RESOURCE_LEVEL");
      const unpaid = GundamTestEngine.create({
        hand: [st07Ptolemaios015],
        resourceArea: restedResources(2),
      }).asPlayer(PLAYER_ONE);
      expectFailure(unpaid.deployBase(st07Ptolemaios015), "INSUFFICIENT_RESOURCES");
      expect(unpaid.getCardZone(st07Ptolemaios015)).toBe(`hand:${PLAYER_ONE}`);
    });
  });

  describe("【Burst】Deploy this card.", () => {
    it("deploys the revealed Base for free and fires Deploy to add another Shield to hand", () => {
      const engine = GundamTestEngine.create(
        { play: [createMockUnit({ ap: 1, hp: 4 })] },
        { shieldArea: [st07Ptolemaios015, createMockUnit({ name: "Other Shield" })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const shieldsBefore = p2.getBoardView().players[PLAYER_TWO]!.shieldCount;
      expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Ptolemaios's Burst");
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));

      expect(p2.getCardZone(burst.sourceCardId)).toBe(`baseSection:${PLAYER_TWO}`);
      expect(p2.getHand()).toHaveLength(1);
      expect(p2.getBoardView().players[PLAYER_TWO]!.shieldCount).toBe(shieldsBefore - 2);
      expect(p2.getCardsInZone("resourceArea")).toHaveLength(0);
    });

    it("moves the revealed Base to trash when its controller declines", () => {
      const engine = GundamTestEngine.create(
        { play: [createMockUnit({ ap: 1, hp: 4 })] },
        { shieldArea: [st07Ptolemaios015] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Ptolemaios's Burst");
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: false } }));
      expect(p2.getCardZone(burst.sourceCardId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getCardsInZone("baseSection")).toHaveLength(0);
    });
  });

  describe("damage prevention while a rested friendly CB Unit is in play", () => {
    it("prevents damage from a non-token enemy Unit at exactly Lv.3", () => {
      const engine = GundamTestEngine.create(
        {
          baseSection: [st07Ptolemaios015],
          play: [{ card: createMockUnit({ traits: ["cb"] }), exhausted: true }],
          deck: 5,
        },
        { play: [createMockUnit({ level: 3, ap: 3 })], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      attackBase(engine);
      const p1 = engine.asPlayer(PLAYER_ONE);
      expect(p1.getDamage(p1.getCardsInZone("baseSection")[0]!)).toBe(0);
    });

    it("does not prevent damage from a Lv.4 Unit", () => {
      const engine = GundamTestEngine.create(
        {
          baseSection: [st07Ptolemaios015],
          play: [{ card: createMockUnit({ traits: ["cb"] }), exhausted: true }],
          deck: 5,
        },
        { play: [createMockUnit({ level: 4, ap: 3 })], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      attackBase(engine);
      const p1 = engine.asPlayer(PLAYER_ONE);
      expect(p1.getDamage(p1.getCardsInZone("baseSection")[0]!)).toBe(3);
    });

    it("does not prevent damage from a Unit token even at Lv.3", () => {
      const engine = GundamTestEngine.create(
        {
          baseSection: [st07Ptolemaios015],
          play: [{ card: createMockUnit({ traits: ["cb"] }), exhausted: true }],
          deck: 5,
        },
        { play: [{ card: createMockUnit({ level: 3, ap: 3 }), isToken: true }], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      attackBase(engine);
      const p1 = engine.asPlayer(PLAYER_ONE);
      expect(p1.getDamage(p1.getCardsInZone("baseSection")[0]!)).toBe(3);
    });

    it("requires the friendly CB Unit to be rested", () => {
      const engine = GundamTestEngine.create(
        { baseSection: [st07Ptolemaios015], play: [createMockUnit({ traits: ["cb"] })], deck: 5 },
        { play: [createMockUnit({ level: 3, ap: 3 })], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      attackBase(engine);
      const p1 = engine.asPlayer(PLAYER_ONE);
      expect(p1.getDamage(p1.getCardsInZone("baseSection")[0]!)).toBe(3);
    });

    it("does not count a rested friendly non-CB Unit or an enemy rested CB Unit", () => {
      const engine = GundamTestEngine.create(
        {
          baseSection: [st07Ptolemaios015],
          play: [{ card: createMockUnit({ traits: ["zeon"] }), exhausted: true }],
          deck: 5,
        },
        {
          play: [
            createMockUnit({ level: 3, ap: 3 }),
            { card: createMockUnit({ traits: ["cb"] }), exhausted: true },
          ],
          deck: 5,
        },
        { initialActivePlayer: PLAYER_TWO },
      );
      attackBase(engine);
      const p1 = engine.asPlayer(PLAYER_ONE);
      expect(p1.getDamage(p1.getCardsInZone("baseSection")[0]!)).toBe(3);
    });
  });
});
