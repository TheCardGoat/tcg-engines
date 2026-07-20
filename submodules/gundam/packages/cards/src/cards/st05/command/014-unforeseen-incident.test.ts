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
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { st05UnforeseenIncident014 } from "./014-unforeseen-incident.ts";

describe("Unforeseen Incident (ST01-014-p4)", () => {
  describe("Printed Lv.3 and cost 1", () => {
    it("cannot be played with only 2 total Resources", () => {
      const enemy = createMockUnit();
      const engine = GundamTestEngine.create(
        { hand: [st05UnforeseenIncident014], resourceArea: activeResources(2) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commandId = p1.getHand()[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.playCommand(commandId, { targets: [enemyId] }),
        "INSUFFICIENT_RESOURCE_LEVEL",
      );
      expect(p1.getCardZone(commandId)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be played when all 3 Resources are rested", () => {
      const enemy = createMockUnit();
      const engine = GundamTestEngine.create(
        { hand: [st05UnforeseenIncident014], resourceArea: restedResources(3) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commandId = p1.getHand()[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.playCommand(commandId, { targets: [enemyId] }), "INSUFFICIENT_RESOURCES");
      expect(p1.getCardZone(commandId)).toBe(`hand:${PLAYER_ONE}`);
    });
  });

  describe("【Burst】Activate this card's 【Main】.", () => {
    it("lets the Shield's owner accept, choose the exact enemy, and apply AP-3", () => {
      const attacker = createMockUnit({ name: "Enemy Attacker", ap: 5, hp: 5 });
      const otherEnemy = createMockUnit({ name: "Other Enemy", ap: 4, hp: 5 });
      const engine = GundamTestEngine.create(
        { shieldArea: [st05UnforeseenIncident014] },
        { play: [attacker, otherEnemy] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [attackerId, otherEnemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p2.enterBattle(attackerId!, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());
      const burst = p1.getBoardView().pendingChoice;
      if (burst?.kind !== "optional")
        throw new Error("Expected Unforeseen Incident's Burst choice");
      const revealedId = burst.sourceCardId;
      expect(burst).toMatchObject({ controllerId: PLAYER_ONE });
      expectSuccess(p1.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        controllerId: PLAYER_ONE,
        sourceCardId: revealedId,
        legalTargetIds: [attackerId, otherEnemyId],
        minTargets: 1,
        maxTargets: 1,
      });
      expectSuccess(p1.resolveEffect({ targets: [otherEnemyId!] }));

      expect(p2.getVisibleCard(attackerId!)?.effectiveAp).toBe(5);
      expect(p2.getVisibleCard(otherEnemyId!)?.effectiveAp).toBe(1);
      expect(p1.getCardZone(revealedId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("moves the revealed Shield to trash without changing AP when its owner declines", () => {
      const attacker = createMockUnit({ ap: 5, hp: 5 });
      const engine = GundamTestEngine.create(
        { shieldArea: [st05UnforeseenIncident014] },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(attackerId, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());
      const burst = p1.getBoardView().pendingChoice;
      if (burst?.kind !== "optional")
        throw new Error("Expected Unforeseen Incident's Burst choice");
      const revealedId = burst.sourceCardId;
      expectSuccess(p1.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: false } }));

      expect(p2.getVisibleCard(attackerId)?.effectiveAp).toBe(5);
      expect(p1.getCardZone(revealedId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });
  });

  describe("【Main】/【Action】Choose 1 enemy Unit. It gets AP-3 during this turn.", () => {
    it("plays during Main, applies AP-3 to the chosen enemy, and moves to trash", () => {
      const enemy = createMockUnit({ ap: 5, hp: 4 });
      const engine = GundamTestEngine.create(
        { hand: [st05UnforeseenIncident014], resourceArea: activeResources(3) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commandId = p1.getHand()[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(commandId, { targets: [enemyId] }));

      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(2);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("plays during the standby player's battle Action Step", () => {
      const attacker = createMockUnit({ ap: 5, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st05UnforeseenIncident014], resourceArea: activeResources(3) },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commandId = p1.getHand()[0]!;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(attackerId, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.playCommand(commandId, { targets: [attackerId] }));

      expect(p2.getVisibleCard(attackerId)?.effectiveAp).toBe(2);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("publishes every enemy Unit as an exact-one choice and affects only the selection", () => {
      const firstEnemy = createMockUnit({ name: "First Enemy", ap: 5 });
      const secondEnemy = createMockUnit({ name: "Second Enemy", ap: 4 });
      const friendly = createMockUnit({ name: "Friendly", ap: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [st05UnforeseenIncident014],
          play: [friendly],
          resourceArea: activeResources(3),
        },
        { play: [firstEnemy, secondEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commandId = p1.getHand()[0]!;
      const [firstEnemyId, secondEnemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(commandId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        controllerId: PLAYER_ONE,
        sourceCardId: commandId,
        legalTargetIds: [firstEnemyId, secondEnemyId],
        minTargets: 1,
        maxTargets: 1,
      });
      expectSuccess(p1.resolveEffect({ targets: [secondEnemyId!] }));

      expect(p2.getVisibleCard(firstEnemyId!)?.effectiveAp).toBe(5);
      expect(p2.getVisibleCard(secondEnemyId!)?.effectiveAp).toBe(1);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("rejects a friendly Unit while a legal enemy exists", () => {
      const friendly = createMockUnit({ ap: 4 });
      const enemy = createMockUnit({ ap: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [st05UnforeseenIncident014],
          play: [friendly],
          resourceArea: activeResources(3),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const commandId = p1.getHand()[0]!;
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.playCommand(commandId, { targets: [friendlyId] }), "INVALID_TARGET");

      expect(p1.getCardZone(commandId)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getVisibleCard(friendlyId)?.effectiveAp).toBe(4);
    });

    it("cannot be played without a legal enemy Unit", () => {
      const engine = GundamTestEngine.create({
        hand: [st05UnforeseenIncident014],
        play: [createMockUnit({ name: "Friendly" })],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const commandId = p1.getHand()[0]!;

      expectFailure(p1.playCommand(commandId), "NO_LEGAL_TARGETS");
      expect(p1.getCardZone(commandId)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("removes the AP penalty when the turn ends", () => {
      const enemy = createMockUnit({ ap: 5, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st05UnforeseenIncident014],
          resourceArea: activeResources(3),
          deck: 5,
        },
        { play: [enemy], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(st05UnforeseenIncident014, { targets: [enemyId] }));
      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(2);
      passTurnThroughPublicMoves(engine, PLAYER_ONE);

      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(5);
    });
  });
});
