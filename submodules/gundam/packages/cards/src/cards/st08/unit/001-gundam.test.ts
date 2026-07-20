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
import { st08Gundam001 } from "./001-gundam.ts";

describe("Ξ Gundam (ST08-001)", () => {
  describe("Lv.9 cost 8 AP5 HP5 Link Unit", () => {
    it("deploys at its printed values and pays eight when no reduction applies", () => {
      const engine = GundamTestEngine.create({
        hand: [st08Gundam001],
        resourceArea: activeResources(9),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectSuccess(p1.deployUnit(st08Gundam001));
      const xiId = p1.getCardsInZone("battleArea")[0]!;
      expect(p1.getVisibleCard(xiId)).toMatchObject({ effectiveAp: 5, effectiveHp: 5 });
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(8);
    });

    it("requires printed Lv.9 when there are no enemy Units", () => {
      const p1 = GundamTestEngine.create({
        hand: [st08Gundam001],
        resourceArea: activeResources(8),
      }).asPlayer(PLAYER_ONE);
      expectFailure(p1.deployUnit(st08Gundam001), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(st08Gundam001)).toBe(`hand:${PLAYER_ONE}`);
    });
  });

  describe("hand Lv./cost reduction per enemy Unit in play", () => {
    it("with one enemy Unit, deploys at Lv.8 and cost 7", () => {
      const engine = GundamTestEngine.create(
        { hand: [st08Gundam001], resourceArea: activeResources(8) },
        { play: [createMockUnit()] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectSuccess(p1.deployUnit(st08Gundam001));
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(7);
    });

    it("with two enemy Units, deploys at Lv.7 and cost 6", () => {
      const engine = GundamTestEngine.create(
        { hand: [st08Gundam001], resourceArea: activeResources(7) },
        { play: [createMockUnit(), createMockUnit()] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectSuccess(p1.deployUnit(st08Gundam001));
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(6);
    });

    it("counts an enemy Unit token in play", () => {
      const engine = GundamTestEngine.create(
        { hand: [st08Gundam001], resourceArea: activeResources(8) },
        { play: [{ card: createMockUnit(), isToken: true }] },
      );
      expectSuccess(engine.asPlayer(PLAYER_ONE).deployUnit(st08Gundam001));
    });

    it("still applies with a friendly Lv.5 Unit, below the printed cutoff", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [st08Gundam001],
          play: [createMockUnit({ level: 5 })],
          resourceArea: activeResources(8),
        },
        { play: [createMockUnit()] },
      );
      expectSuccess(engine.asPlayer(PLAYER_ONE).deployUnit(st08Gundam001));
    });

    it("is entirely disabled by a friendly Unit at exactly Lv.6", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [st08Gundam001],
          play: [createMockUnit({ level: 6 })],
          resourceArea: activeResources(8),
        },
        { play: [createMockUnit(), createMockUnit()] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectFailure(p1.deployUnit(st08Gundam001), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(st08Gundam001)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("does not count enemy Units in hand or trash", () => {
      const engine = GundamTestEngine.create(
        { hand: [st08Gundam001], resourceArea: activeResources(8) },
        { hand: [createMockUnit()], trash: [createMockUnit()] },
      );
      expectFailure(
        engine.asPlayer(PLAYER_ONE).deployUnit(st08Gundam001),
        "INSUFFICIENT_RESOURCE_LEVEL",
      );
    });
  });

  describe("【When Paired】3 damage to one highest-Lv enemy Unit", () => {
    it("offers only the unique highest-Lv enemy and deals exactly 3 damage", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [createMockPilot({ name: "Any Pilot", level: 1, cost: 1 })],
          play: [st08Gundam001],
          resourceArea: activeResources(1),
        },
        {
          play: [createMockUnit({ level: 3, hp: 6 }), createMockUnit({ level: 7, hp: 6 })],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const xiId = p1.getCardsInZone("battleArea")[0]!;
      const [lowId, highId] = p2.getCardsInZone("battleArea");
      const pilotId = p1.getHand()[0]!;
      expectSuccess(p1.assignPilot(pilotId, xiId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: xiId,
        legalTargetIds: [highId],
        minTargets: 1,
        maxTargets: 1,
      });
      expectFailure(p1.resolveEffect({ targets: [lowId!] }), "ILLEGAL_TARGET");
      expectSuccess(p1.resolveEffect({ targets: [highId!] }));
      expect(p2.getDamage(highId!)).toBe(3);
      expect(p2.getDamage(lowId!)).toBe(0);
      expect(p1.getPilotId(xiId)).toBe(pilotId);
    });

    it("offers every enemy tied for highest Lv but damages only the chosen one", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [createMockPilot({ level: 1, cost: 1 })],
          play: [st08Gundam001],
          resourceArea: activeResources(1),
        },
        { play: [createMockUnit({ level: 5, hp: 6 }), createMockUnit({ level: 5, hp: 6 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [firstId, secondId] = p2.getCardsInZone("battleArea");
      expectSuccess(p1.assignPilot(p1.getHand()[0]!, p1.getCardsInZone("battleArea")[0]!));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: expect.arrayContaining([firstId, secondId]),
      });
      expectSuccess(p1.resolveEffect({ targets: [secondId!] }));
      expect(p2.getDamage(firstId!)).toBe(0);
      expect(p2.getDamage(secondId!)).toBe(3);
    });

    it("destroys a highest-Lv enemy Unit with exactly 3 HP", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [createMockPilot({ level: 1, cost: 1 })],
          play: [st08Gundam001],
          resourceArea: activeResources(1),
        },
        { play: [createMockUnit({ level: 4, hp: 3 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(p1.getHand()[0]!, p1.getCardsInZone("battleArea")[0]!));
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
      expect(p2.getCardZone(enemyId)).toBe(`trash:${PLAYER_TWO}`);
    });

    it("rejects a friendly Unit even if its Lv. is as high as the enemy maximum", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [createMockPilot({ level: 1, cost: 1 })],
          play: [st08Gundam001, createMockUnit({ level: 7 })],
          resourceArea: activeResources(1),
        },
        { play: [createMockUnit({ level: 7, hp: 6 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const xiId = p1.getCardsInZone("battleArea")[0]!;
      const friendlyId = p1.getCardsInZone("battleArea")[1]!;
      expectSuccess(p1.assignPilot(p1.getHand()[0]!, xiId));
      expectFailure(p1.resolveEffect({ targets: [friendlyId] }), "ILLEGAL_TARGET");
    });

    it("pairs successfully and skips the trigger when the opponent has no Unit", () => {
      const engine = GundamTestEngine.create({
        hand: [createMockPilot({ level: 1, cost: 1 })],
        play: [st08Gundam001],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const xiId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(p1.getHand()[0]!, xiId));
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getPilotId(xiId)).toBeDefined();
    });
  });
});
