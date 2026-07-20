import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectAttackRedirectedTo,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { st05McgillisSchwalbeGraze007 } from "./007-mcgillis-schwalbe-graze.ts";

describe("McGillis' Schwalbe Graze (ST05-007)", () => {
  describe("<Blocker> (Rest this Unit to change the attack target to it.)", () => {
    it("rests, redirects an attack, and protects the original friendly target", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const originalTarget = createMockUnit({ name: "Original Target", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        {
          play: [st05McgillisSchwalbeGraze007, { card: originalTarget, exhausted: true }],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const [blockerId, originalTargetId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(attackerId, originalTargetId!));
      expectSuccess(p2.declareBlock(blockerId!));

      expect(p2.isExhausted(blockerId!)).toBe(true);
      expectAttackRedirectedTo(engine, blockerId!);

      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getDamage(blockerId!)).toBe(1);
      expect(p2.getDamage(originalTargetId!)).toBe(0);
    });

    it("can intercept a direct attack", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        {
          play: [st05McgillisSchwalbeGraze007],
          shieldArea: [createMockUnit({ name: "Shield" })],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const blockerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.declareBlock(blockerId));

      expectAttackRedirectedTo(engine, blockerId);
      expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(1);
    });

    it("cannot block while rested", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        {
          play: [{ card: st05McgillisSchwalbeGraze007, exhausted: true }],
          shieldArea: [createMockUnit({ name: "Shield" })],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const blockerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectFailure(p2.declareBlock(blockerId), "CANNOT_BLOCK");

      expect(p2.isExhausted(blockerId)).toBe(true);
    });

    it("cannot block an attack that originally targeted itself", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: st05McgillisSchwalbeGraze007, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const blockerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, blockerId));
      expectFailure(p2.declareBlock(blockerId), "BLOCKER_IS_TARGET");
    });
  });

  describe("【When Paired】Choose 1 enemy Unit that is Lv.3 or lower. It gets AP-2 during this turn.", () => {
    it("lets the pairing player choose an exact Lv.3 enemy and reduces only its AP", () => {
      const pilot = createMockPilot({ name: "Pairing Pilot", level: 1, cost: 1 });
      const firstEnemy = createMockUnit({ name: "First Enemy", level: 2, ap: 4, hp: 5 });
      const secondEnemy = createMockUnit({ name: "Second Enemy", level: 3, ap: 5, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [st05McgillisSchwalbeGraze007],
          resourceArea: activeResources(4),
        },
        { play: [firstEnemy, secondEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const grazeId = p1.getCardsInZone("battleArea")[0]!;
      const [firstEnemyId, secondEnemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(pilot, grazeId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: grazeId,
        legalTargetIds: expect.arrayContaining([firstEnemyId, secondEnemyId]),
        minTargets: 1,
        maxTargets: 1,
      });
      expectSuccess(p1.resolveEffect({ targets: [secondEnemyId!] }));

      expect(p2.getVisibleCard(firstEnemyId!)?.effectiveAp).toBe(4);
      expect(p2.getVisibleCard(secondEnemyId!)?.effectiveAp).toBe(3);
    });

    it("rejects an enemy Unit that is Lv.4", () => {
      const pilot = createMockPilot({ name: "Pairing Pilot", level: 1, cost: 1 });
      const eligible = createMockUnit({ name: "Eligible", level: 3, ap: 4, hp: 5 });
      const tooHigh = createMockUnit({ name: "Too High", level: 4, ap: 4, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [st05McgillisSchwalbeGraze007],
          resourceArea: activeResources(4),
        },
        { play: [eligible, tooHigh] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const grazeId = p1.getCardsInZone("battleArea")[0]!;
      const [eligibleId, tooHighId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(pilot, grazeId));
      expectFailure(p1.resolveEffect({ targets: [tooHighId!] }), "ILLEGAL_TARGET");

      expect(p2.getVisibleCard(eligibleId!)?.effectiveAp).toBe(4);
      expect(p2.getVisibleCard(tooHighId!)?.effectiveAp).toBe(4);
    });

    it("rejects a friendly Lv.3 Unit", () => {
      const pilot = createMockPilot({ name: "Pairing Pilot", level: 1, cost: 1 });
      const friendly = createMockUnit({ name: "Friendly", level: 3, ap: 4, hp: 5 });
      const enemy = createMockUnit({ name: "Enemy", level: 3, ap: 4, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [st05McgillisSchwalbeGraze007, friendly],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const grazeId = p1.getCardsInZone("battleArea")[0]!;
      const friendlyId = p1.getCardsInZone("battleArea")[1]!;

      expectSuccess(p1.assignPilot(pilot, grazeId));
      expectFailure(p1.resolveEffect({ targets: [friendlyId] }), "ILLEGAL_TARGET");

      expect(p1.getVisibleCard(friendlyId)?.effectiveAp).toBe(4);
    });

    it("cleanly skips when no enemy Unit is Lv.3 or lower", () => {
      const pilot = createMockPilot({ name: "Pairing Pilot", level: 1, cost: 1 });
      const tooHigh = createMockUnit({ name: "Too High", level: 4, ap: 4, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [st05McgillisSchwalbeGraze007],
          resourceArea: activeResources(4),
        },
        { play: [tooHigh] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const grazeId = p1.getCardsInZone("battleArea")[0]!;
      const tooHighId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, grazeId));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getVisibleCard(tooHighId)?.effectiveAp).toBe(4);
      expect(p1.getPilotId(grazeId)).toBe(p1.getCardsInZone("battleArea")[1]);
    });

    it("removes the AP reduction at the end of the turn", () => {
      const pilot = createMockPilot({ name: "Pairing Pilot", level: 1, cost: 1 });
      const enemy = createMockUnit({ name: "Enemy", level: 3, ap: 4, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [st05McgillisSchwalbeGraze007],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const grazeId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, grazeId));
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(2);

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());

      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(4);
    });
  });

  describe("Link Condition: [McGillis Fareed]", () => {
    it("can attack on its deploy turn after McGillis Fareed is paired", () => {
      const mcgillis = createMockPilot({ name: "McGillis Fareed", level: 1, cost: 1 });
      const enemy = createMockUnit({ name: "Enemy", level: 4, hp: 8 });
      const engine = GundamTestEngine.create(
        {
          hand: [st05McgillisSchwalbeGraze007, mcgillis],
          resourceArea: activeResources(4),
        },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.deployUnit(st05McgillisSchwalbeGraze007));
      const grazeId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(mcgillis, grazeId));
      expectSuccess(p1.enterBattle(grazeId, enemyId));

      expect(p1.getBoardView().pendingCombat).toMatchObject({ attackerId: grazeId });
    });

    it("cannot attack on its deploy turn after a different Pilot is paired", () => {
      const otherPilot = createMockPilot({ name: "Gaelio Bauduin", level: 1, cost: 1 });
      const enemy = createMockUnit({ name: "Enemy", level: 4, hp: 8 });
      const engine = GundamTestEngine.create(
        {
          hand: [st05McgillisSchwalbeGraze007, otherPilot],
          resourceArea: activeResources(4),
        },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.deployUnit(st05McgillisSchwalbeGraze007));
      const grazeId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(otherPilot, grazeId));
      expectFailure(p1.enterBattle(grazeId, enemyId), "CANNOT_ATTACK");

      expect(p1.getBoardView().pendingCombat).toBeUndefined();
    });
  });

  describe("playing McGillis' Schwalbe Graze", () => {
    it("pays 3 Resources and deploys it to the battle area", () => {
      const engine = GundamTestEngine.create({
        hand: [st05McgillisSchwalbeGraze007],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const grazeId = p1.getHand()[0]!;

      expectSuccess(p1.deployUnit(grazeId));

      expect(p1.getCardZone(grazeId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(3);
    });

    it("cannot be deployed below its printed Lv.4 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [st05McgillisSchwalbeGraze007],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployUnit(st05McgillisSchwalbeGraze007), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(st05McgillisSchwalbeGraze007)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pay its printed cost without 3 active Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st05McgillisSchwalbeGraze007],
        resourceArea: [...activeResources(2), ...restedResources(2)],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployUnit(st05McgillisSchwalbeGraze007), "INSUFFICIENT_RESOURCES");
      expect(p1.getCardZone(st05McgillisSchwalbeGraze007)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be deployed during a legally reached Action step", () => {
      const engine = GundamTestEngine.create({
        hand: [st05McgillisSchwalbeGraze007],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(p1.deployUnit(st05McgillisSchwalbeGraze007), "WRONG_PHASE");

      expect(p1.getCardZone(st05McgillisSchwalbeGraze007)).toBe(`hand:${PLAYER_ONE}`);
    });
  });
});
