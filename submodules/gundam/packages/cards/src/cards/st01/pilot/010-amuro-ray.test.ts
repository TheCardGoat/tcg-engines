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
import { st01AmuroRay010 } from "./010-amuro-ray.ts";

describe("Amuro Ray (ST01-010)", () => {
  describe("【Burst】Add this card to your hand.", () => {
    it("adds Amuro Ray to hand when its controller accepts the revealed Shield prompt", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st01AmuroRay010] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expect(p2.getBoardView().pendingChoice).toMatchObject({
        kind: "optional",
        directiveIndex: -1,
      });
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

      const amuroId = p2.getHand()[0]!;
      expect(p2.getCardZone(amuroId)).toBe(`hand:${PLAYER_TWO}`);
    });

    it("puts Amuro Ray into trash when its controller declines Burst", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st01AmuroRay010] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: false } }));

      expect(p2.getHand()).toHaveLength(0);
      expect(p2.getBoardView().players[PLAYER_TWO]?.trashCount).toBe(1);
    });
  });

  describe("【When Paired】Choose 1 enemy Unit with 5 or less HP. Rest it.", () => {
    it("asks for an eligible enemy, rests the chosen Unit, and leaves Amuro paired", () => {
      const host = createMockUnit({ name: "Host", ap: 2, hp: 3 });
      const firstEnemy = createMockUnit({ name: "First Enemy", hp: 5 });
      const secondEnemy = createMockUnit({ name: "Second Enemy", hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [st01AmuroRay010],
          play: [host],
          resourceArea: activeResources(4),
        },
        { play: [firstEnemy, secondEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const [firstEnemyId, secondEnemyId] = p2.getCardsInZone("battleArea");
      const amuroId = p1.getHand()[0]!;

      expectSuccess(p1.assignPilot(amuroId, hostId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: amuroId,
        legalTargetIds: expect.arrayContaining([firstEnemyId, secondEnemyId]),
        minTargets: 1,
        maxTargets: 1,
      });
      expectSuccess(p1.resolveEffect({ targets: [secondEnemyId!] }));

      expect(p2.isExhausted(firstEnemyId!)).toBe(false);
      expect(p2.isExhausted(secondEnemyId!)).toBe(true);
      expect(p1.getPilotId(hostId)).toBe(amuroId);
      expect(p1.getCardZone(amuroId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 4, effectiveHp: 4 });
    });

    it("includes an enemy Unit with exactly 5 HP", () => {
      const host = createMockUnit({ name: "Host" });
      const enemy = createMockUnit({ name: "Exact Threshold", hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st01AmuroRay010], play: [host], resourceArea: activeResources(4) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(st01AmuroRay010, hostId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [enemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(p2.isExhausted(enemyId)).toBe(true);
    });

    it("rejects an enemy Unit with more than 5 HP", () => {
      const host = createMockUnit({ name: "Host" });
      const eligible = createMockUnit({ name: "Eligible", hp: 5 });
      const tooLarge = createMockUnit({ name: "Too Large", hp: 6 });
      const engine = GundamTestEngine.create(
        { hand: [st01AmuroRay010], play: [host], resourceArea: activeResources(4) },
        { play: [eligible, tooLarge] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const [eligibleId, tooLargeId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(st01AmuroRay010, hostId));
      expectFailure(p1.resolveEffect({ targets: [tooLargeId!] }), "ILLEGAL_TARGET");

      expect(p2.isExhausted(eligibleId!)).toBe(false);
      expect(p2.isExhausted(tooLargeId!)).toBe(false);
    });

    it("rejects a friendly Unit even when it has 5 or less HP", () => {
      const host = createMockUnit({ name: "Host" });
      const friendly = createMockUnit({ name: "Friendly Candidate", hp: 5 });
      const enemy = createMockUnit({ name: "Enemy Candidate", hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st01AmuroRay010],
          play: [host, friendly],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const friendlyId = p1.getCardsInZone("battleArea")[1]!;

      expectSuccess(p1.assignPilot(st01AmuroRay010, hostId));
      expectFailure(p1.resolveEffect({ targets: [friendlyId] }), "ILLEGAL_TARGET");

      expect(p1.isExhausted(friendlyId)).toBe(false);
    });

    it("pairs successfully and cleanly skips the trigger when no legal enemy exists", () => {
      const host = createMockUnit({ name: "Host" });
      const tooLarge = createMockUnit({ name: "Too Large", hp: 6 });
      const engine = GundamTestEngine.create(
        { hand: [st01AmuroRay010], play: [host], resourceArea: activeResources(4) },
        { play: [tooLarge] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const tooLargeId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(st01AmuroRay010, hostId));

      expect(p1.getPilotId(hostId)).toBe(p1.getCardsInZone("battleArea")[1]);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.isExhausted(tooLargeId)).toBe(false);
    });

    it("cannot pair Amuro below his printed Lv.4 requirement", () => {
      const host = createMockUnit({ name: "Host" });
      const engine = GundamTestEngine.create({
        hand: [st01AmuroRay010],
        play: [host],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.assignPilot(st01AmuroRay010, hostId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getCardZone(st01AmuroRay010)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pay Amuro's printed cost without an active Resource", () => {
      const host = createMockUnit({ name: "Host" });
      const engine = GundamTestEngine.create({
        hand: [st01AmuroRay010],
        play: [host],
        resourceArea: restedResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.assignPilot(st01AmuroRay010, hostId), "INSUFFICIENT_RESOURCES");

      expect(p1.getCardZone(st01AmuroRay010)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pair Amuro during a legally reached Action step", () => {
      const host = createMockUnit({ name: "Host" });
      const engine = GundamTestEngine.create({
        hand: [st01AmuroRay010],
        play: [host],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(p1.assignPilot(st01AmuroRay010, hostId), "WRONG_PHASE");

      expect(p1.getCardZone(st01AmuroRay010)).toBe(`hand:${PLAYER_ONE}`);
    });
  });
});
