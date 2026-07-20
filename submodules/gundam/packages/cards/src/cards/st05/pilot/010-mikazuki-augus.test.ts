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
import { st05MikazukiAugus010 } from "./010-mikazuki-augus.ts";

describe("Mikazuki Augus (ST05-010)", () => {
  describe("【Burst】Add this card to your hand.", () => {
    it("adds Mikazuki Augus to hand when its controller accepts the revealed Shield prompt", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st05MikazukiAugus010] },
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

      const mikazukiId = p2.getHand()[0]!;
      expect(p2.getCardZone(mikazukiId)).toBe(`hand:${PLAYER_TWO}`);
      expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(0);
    });

    it("puts Mikazuki Augus into trash when its controller declines Burst", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st05MikazukiAugus010] },
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

  describe("【When Paired】Choose 1 of your Units and 1 enemy Unit. Deal 1 damage to them.", () => {
    it("publishes separate friendly and enemy groups and damages both selected physical Units", () => {
      const host = createMockUnit({ name: "Host", hp: 5 });
      const firstAlly = createMockUnit({ name: "First Ally", hp: 5 });
      const secondAlly = createMockUnit({ name: "Second Ally", hp: 5 });
      const firstEnemy = createMockUnit({ name: "First Enemy", hp: 5 });
      const secondEnemy = createMockUnit({ name: "Second Enemy", hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st05MikazukiAugus010],
          play: [host, firstAlly, secondAlly],
          resourceArea: activeResources(4),
        },
        { play: [firstEnemy, secondEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [hostId, firstAllyId, secondAllyId] = p1.getCardsInZone("battleArea");
      const [firstEnemyId, secondEnemyId] = p2.getCardsInZone("battleArea");
      const mikazukiId = p1.getHand()[0]!;

      expectSuccess(p1.assignPilot(mikazukiId, hostId!));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection") {
        throw new Error("Expected Mikazuki's controller to choose friendly and enemy Units");
      }
      expect(choice.sourceCardId).toBe(mikazukiId);
      expect(choice.minTargets).toBe(2);
      expect(choice.maxTargets).toBe(2);
      expect(choice.groups).toHaveLength(2);
      expect(choice.groups[0]?.legalTargetIds).toEqual(
        expect.arrayContaining([hostId, firstAllyId, secondAllyId]),
      );
      expect(choice.groups[1]?.legalTargetIds).toEqual(
        expect.arrayContaining([firstEnemyId, secondEnemyId]),
      );
      expectSuccess(p1.resolveEffect({ targets: [secondAllyId!, secondEnemyId!] }));

      expect(p1.getDamage(hostId!)).toBe(0);
      expect(p1.getDamage(firstAllyId!)).toBe(0);
      expect(p1.getDamage(secondAllyId!)).toBe(1);
      expect(p2.getDamage(firstEnemyId!)).toBe(0);
      expect(p2.getDamage(secondEnemyId!)).toBe(1);
      expect(p1.getPilotId(hostId!)).toBe(mikazukiId);
      expect(p1.getVisibleCard(hostId!)).toMatchObject({ effectiveAp: 4, effectiveHp: 6 });
    });

    it("can choose and damage the Unit paired with Mikazuki", () => {
      const host = createMockUnit({ name: "Host", ap: 0, hp: 3 });
      const enemy = createMockUnit({ name: "Enemy", hp: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [st05MikazukiAugus010],
          play: [host],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(st05MikazukiAugus010, hostId));
      expectSuccess(p1.resolveEffect({ targets: [hostId, enemyId] }));

      expect(p1.getDamage(hostId)).toBe(1);
      expect(p2.getDamage(enemyId)).toBe(1);
      expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 2, effectiveHp: 4 });
    });

    it("rejects a selection without one enemy Unit", () => {
      const host = createMockUnit({ name: "Host", hp: 5 });
      const ally = createMockUnit({ name: "Ally", hp: 5 });
      const enemy = createMockUnit({ name: "Enemy", hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st05MikazukiAugus010],
          play: [host, ally],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [hostId, allyId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(st05MikazukiAugus010, hostId!));
      expectFailure(p1.resolveEffect({ targets: [hostId!, allyId!] }), "WRONG_TARGET_COUNT");

      expect(p1.getDamage(hostId!)).toBe(0);
      expect(p1.getDamage(allyId!)).toBe(0);
    });

    it("skips the entire trigger when there is no enemy Unit to choose", () => {
      const host = createMockUnit({ name: "Host", hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [st05MikazukiAugus010],
        play: [host],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(st05MikazukiAugus010, hostId));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getDamage(hostId)).toBe(0);
      expect(p1.getPilotId(hostId)).toBe(p1.getCardsInZone("battleArea")[1]);
    });

    it("destroys both selected Units when each has only 1 HP", () => {
      const host = createMockUnit({ name: "Host", hp: 5 });
      const fragileAlly = createMockUnit({ name: "Fragile Ally", hp: 1 });
      const fragileEnemy = createMockUnit({ name: "Fragile Enemy", hp: 1 });
      const engine = GundamTestEngine.create(
        {
          hand: [st05MikazukiAugus010],
          play: [host, fragileAlly],
          resourceArea: activeResources(4),
        },
        { play: [fragileEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [hostId, fragileAllyId] = p1.getCardsInZone("battleArea");
      const fragileEnemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(st05MikazukiAugus010, hostId!));
      expectSuccess(p1.resolveEffect({ targets: [fragileAllyId!, fragileEnemyId] }));

      expect(p1.getCardZone(fragileAllyId!)).toBe(`trash:${PLAYER_ONE}`);
      expect(p2.getCardZone(fragileEnemyId)).toBe(`trash:${PLAYER_TWO}`);
    });
  });

  describe("pairing Mikazuki Augus", () => {
    it("pays 1 Resource, pairs beneath the Unit, and grants AP+2/HP+1", () => {
      const host = createMockUnit({ name: "Host", ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [st05MikazukiAugus010],
        play: [host],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const mikazukiId = p1.getHand()[0]!;

      expectSuccess(p1.assignPilot(mikazukiId, hostId));

      expect(p1.getPilotId(hostId)).toBe(mikazukiId);
      expect(p1.getCardZone(mikazukiId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 4, effectiveHp: 4 });
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(1);
    });

    it("cannot pair Mikazuki below his printed Lv.4 requirement", () => {
      const host = createMockUnit({ name: "Host" });
      const engine = GundamTestEngine.create({
        hand: [st05MikazukiAugus010],
        play: [host],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.assignPilot(st05MikazukiAugus010, hostId), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(st05MikazukiAugus010)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pay Mikazuki's printed cost without an active Resource", () => {
      const host = createMockUnit({ name: "Host" });
      const engine = GundamTestEngine.create({
        hand: [st05MikazukiAugus010],
        play: [host],
        resourceArea: restedResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.assignPilot(st05MikazukiAugus010, hostId), "INSUFFICIENT_RESOURCES");
      expect(p1.getCardZone(st05MikazukiAugus010)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pair Mikazuki during a legally reached Action step", () => {
      const host = createMockUnit({ name: "Host" });
      const engine = GundamTestEngine.create({
        hand: [st05MikazukiAugus010],
        play: [host],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(p1.assignPilot(st05MikazukiAugus010, hostId), "WRONG_PHASE");

      expect(p1.getCardZone(st05MikazukiAugus010)).toBe(`hand:${PLAYER_ONE}`);
    });
  });
});
