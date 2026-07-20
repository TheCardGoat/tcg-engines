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
import { st08Davao015 } from "./015-davao.ts";

describe("Davao (ST08-015)", () => {
  describe("Lv.3 cost 1 HP5 Base and Deploy", () => {
    it("deploys the exact card, pays one Resource, and adds one Shield to hand", () => {
      const engine = GundamTestEngine.create({
        hand: [st08Davao015],
        resourceArea: activeResources(3),
        shieldArea: [createMockUnit({ name: "First Shield" }), createMockUnit({ name: "Second" })],
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

    it("still deploys when there is no Shield to add", () => {
      const engine = GundamTestEngine.create({
        hand: [st08Davao015],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const baseId = p1.getHand()[0]!;
      expectSuccess(p1.deployBase(baseId));
      expect(p1.getCardZone(baseId)).toBe(`baseSection:${PLAYER_ONE}`);
      expect(p1.getHand()).toHaveLength(0);
    });

    it("cannot deploy below Lv.3 or without one active Resource", () => {
      const low = GundamTestEngine.create({
        hand: [st08Davao015],
        resourceArea: activeResources(2),
      }).asPlayer(PLAYER_ONE);
      expectFailure(low.deployBase(st08Davao015), "INSUFFICIENT_RESOURCE_LEVEL");
      const unpaid = GundamTestEngine.create({
        hand: [st08Davao015],
        resourceArea: restedResources(3),
      }).asPlayer(PLAYER_ONE);
      expectFailure(unpaid.deployBase(st08Davao015), "INSUFFICIENT_RESOURCES");
      expect(unpaid.getCardZone(st08Davao015)).toBe(`hand:${PLAYER_ONE}`);
    });
  });

  describe("【Burst】Deploy this card.", () => {
    it("deploys for free and fires Deploy to add the remaining Shield to hand", () => {
      const engine = GundamTestEngine.create(
        { play: [createMockUnit({ ap: 1, hp: 4 })] },
        { shieldArea: [st08Davao015, createMockUnit({ name: "Other Shield" })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const shieldsBefore = p2.getBoardView().players[PLAYER_TWO]!.shieldCount;
      expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Davao's Burst choice");
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));
      expect(p2.getCardZone(burst.sourceCardId)).toBe(`baseSection:${PLAYER_TWO}`);
      expect(p2.getHand()).toHaveLength(1);
      expect(p2.getBoardView().players[PLAYER_TWO]!.shieldCount).toBe(shieldsBefore - 2);
      expect(p2.getCardsInZone("resourceArea")).toHaveLength(0);
    });

    it("moves the revealed Base to trash when declined", () => {
      const engine = GundamTestEngine.create(
        { play: [createMockUnit({ ap: 1, hp: 4 })] },
        { shieldArea: [st08Davao015] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Davao's Burst choice");
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: false } }));
      expect(p2.getCardZone(burst.sourceCardId)).toBe(`trash:${PLAYER_TWO}`);
    });
  });

  describe("【Activate·Main】【Once per Turn】②：recover 2 HP from one friendly Unit", () => {
    it("prompts for exactly one friendly Unit, pays two, and recovers exactly 2 damage", () => {
      const engine = GundamTestEngine.create({
        baseSection: [st08Davao015],
        play: [
          { card: createMockUnit({ hp: 5 }), damage: 3 },
          { card: createMockUnit({ hp: 5 }), damage: 1 },
        ],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const baseId = p1.getCardsInZone("baseSection")[0]!;
      const [firstId, secondId] = p1.getCardsInZone("battleArea");
      expectSuccess(p1.activateBaseAbility(baseId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        controllerId: PLAYER_ONE,
        sourceCardId: baseId,
        legalTargetIds: expect.arrayContaining([firstId, secondId]),
        minTargets: 1,
        maxTargets: 1,
      });
      expectSuccess(p1.resolveEffect({ targets: [firstId!] }));
      expect(p1.getDamage(firstId!)).toBe(1);
      expect(p1.getDamage(secondId!)).toBe(1);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
    });

    it("never recovers below zero damage", () => {
      const engine = GundamTestEngine.create({
        baseSection: [st08Davao015],
        play: [{ card: createMockUnit({ hp: 5 }), damage: 1 }],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.activateBaseAbility(st08Davao015, { targets: [unitId] }));
      expect(p1.getDamage(unitId)).toBe(0);
    });

    it("rejects an enemy Unit and leaves it unchanged", () => {
      const engine = GundamTestEngine.create(
        {
          baseSection: [st08Davao015],
          play: [{ card: createMockUnit({ hp: 5 }), damage: 1 }],
          resourceArea: activeResources(2),
        },
        { play: [{ card: createMockUnit({ hp: 5 }), damage: 2 }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      expectFailure(p1.activateBaseAbility(st08Davao015, { targets: [enemyId] }), "ILLEGAL_TARGET");
      expect(p2.getDamage(enemyId)).toBe(2);
    });

    it("cannot activate without a friendly Unit", () => {
      const p1 = GundamTestEngine.create({
        baseSection: [st08Davao015],
        resourceArea: activeResources(2),
      }).asPlayer(PLAYER_ONE);
      expectFailure(p1.activateBaseAbility(st08Davao015), "NO_LEGAL_TARGETS");
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(0);
    });

    it("cannot activate without two active Resources", () => {
      const engine = GundamTestEngine.create({
        baseSection: [st08Davao015],
        play: [{ card: createMockUnit({ hp: 5 }), damage: 2 }],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      expectFailure(
        p1.activateBaseAbility(st08Davao015, { targets: [unitId] }),
        "INSUFFICIENT_RESOURCES",
      );
      expect(p1.getDamage(unitId)).toBe(2);
    });

    it("cannot activate twice in the same turn", () => {
      const engine = GundamTestEngine.create({
        baseSection: [st08Davao015],
        play: [{ card: createMockUnit({ hp: 5 }), damage: 4 }],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.activateBaseAbility(st08Davao015, { targets: [unitId] }));
      expectFailure(
        p1.activateBaseAbility(st08Davao015, { targets: [unitId] }),
        "ABILITY_LIMIT_REACHED",
      );
      expect(p1.getDamage(unitId)).toBe(2);
    });

    it("resets its once-per-turn limit on its controller's next turn", () => {
      const engine = GundamTestEngine.create(
        {
          baseSection: [st08Davao015],
          play: [{ card: createMockUnit({ hp: 6 }), damage: 5 }],
          resourceArea: activeResources(4),
          deck: 5,
        },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.activateBaseAbility(st08Davao015, { targets: [unitId] }));
      expect(p1.getDamage(unitId)).toBe(3);
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.passPhase());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.activateBaseAbility(st08Davao015, { targets: [unitId] }));
      expect(p1.getDamage(unitId)).toBe(1);
    });

    it("cannot activate outside the Main Phase", () => {
      const engine = GundamTestEngine.create({
        baseSection: [st08Davao015],
        play: [{ card: createMockUnit({ hp: 5 }), damage: 2 }],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(p1.activateBaseAbility(st08Davao015, { targets: [unitId] }), "WRONG_PHASE");
      expect(p1.getDamage(unitId)).toBe(2);
    });
  });
});
