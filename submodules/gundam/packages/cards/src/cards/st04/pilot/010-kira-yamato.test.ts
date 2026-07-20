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
import { st04KiraYamato010 } from "./010-kira-yamato.ts";

describe("Kira Yamato (ST04-010)", () => {
  describe("【Burst】Add this card to your hand.", () => {
    it("adds Kira Yamato to hand when the Shield owner accepts Burst", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st04KiraYamato010] },
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

      const kiraId = p2.getHand()[0]!;
      expect(p2.getCardZone(kiraId)).toBe(`hand:${PLAYER_TWO}`);
      expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(0);
    });

    it("puts Kira Yamato into trash when the Shield owner declines Burst", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st04KiraYamato010] },
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

      expect(p2.getHand()).toHaveLength(0);
      expect(p2.getBoardView().players[PLAYER_TWO]?.trashCount).toBe(1);
    });
  });

  describe("【Attack】Choose 1 enemy Unit. It gets AP-2 during this battle.", () => {
    it("asks for exactly one enemy Unit and gives only the chosen Unit AP-2", () => {
      const host = createMockUnit({ name: "Host", ap: 3, hp: 8 });
      const firstEnemy = createMockUnit({ name: "First Enemy", ap: 5, hp: 8 });
      const secondEnemy = createMockUnit({ name: "Second Enemy", ap: 4, hp: 8 });
      const engine = GundamTestEngine.create(
        {
          hand: [st04KiraYamato010],
          play: [host],
          resourceArea: activeResources(4),
        },
        { play: [{ card: firstEnemy, exhausted: true }, secondEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const [firstEnemyId, secondEnemyId] = p2.getCardsInZone("battleArea");
      const kiraId = p1.getHand()[0]!;

      expectSuccess(p1.assignPilot(kiraId, hostId));
      expectSuccess(p1.enterBattle(hostId, firstEnemyId!));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: kiraId,
        legalTargetIds: expect.arrayContaining([firstEnemyId, secondEnemyId]),
        minTargets: 1,
        maxTargets: 1,
      });
      expectSuccess(p1.resolveEffect({ targets: [secondEnemyId!] }));

      expect(p2.getVisibleCard(firstEnemyId!)?.effectiveAp).toBe(5);
      expect(p2.getVisibleCard(secondEnemyId!)?.effectiveAp).toBe(2);
      expect(p1.getPilotId(hostId)).toBe(kiraId);
    });

    it("rejects a friendly Unit target", () => {
      const host = createMockUnit({ name: "Host", ap: 3, hp: 8 });
      const friendly = createMockUnit({ name: "Friendly", ap: 4, hp: 8 });
      const enemy = createMockUnit({ name: "Enemy", ap: 5, hp: 8 });
      const engine = GundamTestEngine.create(
        {
          hand: [st04KiraYamato010],
          play: [host, friendly],
          resourceArea: activeResources(4),
        },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [hostId, friendlyId] = p1.getCardsInZone("battleArea");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(st04KiraYamato010, hostId!));
      expectSuccess(p1.enterBattle(hostId!, enemyId));
      expectFailure(p1.resolveEffect({ targets: [friendlyId!] }), "ILLEGAL_TARGET");

      expect(p1.getVisibleCard(friendlyId!)?.effectiveAp).toBe(4);
      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(5);
    });

    it("does not trigger while Kira Yamato is unpaired", () => {
      const host = createMockUnit({ name: "Host", ap: 3, hp: 8 });
      const enemy = createMockUnit({ name: "Enemy", ap: 5, hp: 8 });
      const engine = GundamTestEngine.create(
        { play: [host] },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(hostId, enemyId));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(5);
    });

    it("restores the chosen Unit's AP when the battle ends", () => {
      const host = createMockUnit({ name: "Host", ap: 1, hp: 8 });
      const enemy = createMockUnit({ name: "Enemy", ap: 5, hp: 8 });
      const engine = GundamTestEngine.create(
        {
          hand: [st04KiraYamato010],
          play: [host],
          resourceArea: activeResources(4),
        },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(st04KiraYamato010, hostId));
      expectSuccess(p1.enterBattle(hostId, enemyId));
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(3);
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(5);
    });
  });

  describe("pairing Kira Yamato", () => {
    it("pays 1 Resource, pairs beneath the Unit, and grants AP+2/HP+1", () => {
      const host = createMockUnit({ name: "Host", ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [st04KiraYamato010],
        play: [host],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const kiraId = p1.getHand()[0]!;

      expectSuccess(p1.assignPilot(kiraId, hostId));

      expect(p1.getPilotId(hostId)).toBe(kiraId);
      expect(p1.getCardZone(kiraId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 4, effectiveHp: 4 });
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(1);
    });

    it("cannot pair below Kira Yamato's printed Lv.4 requirement", () => {
      const host = createMockUnit({ name: "Host" });
      const engine = GundamTestEngine.create({
        hand: [st04KiraYamato010],
        play: [host],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(
        p1.assignPilot(st04KiraYamato010, p1.getCardsInZone("battleArea")[0]!),
        "INSUFFICIENT_RESOURCE_LEVEL",
      );
      expect(p1.getCardZone(st04KiraYamato010)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pay Kira Yamato's printed cost without an active Resource", () => {
      const host = createMockUnit({ name: "Host" });
      const engine = GundamTestEngine.create({
        hand: [st04KiraYamato010],
        play: [host],
        resourceArea: restedResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(
        p1.assignPilot(st04KiraYamato010, p1.getCardsInZone("battleArea")[0]!),
        "INSUFFICIENT_RESOURCES",
      );
      expect(p1.getCardZone(st04KiraYamato010)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pair during a legally reached Action step", () => {
      const host = createMockUnit({ name: "Host" });
      const engine = GundamTestEngine.create({
        hand: [st04KiraYamato010],
        play: [host],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(
        p1.assignPilot(st04KiraYamato010, p1.getCardsInZone("battleArea")[0]!),
        "WRONG_PHASE",
      );
    });
  });
});
