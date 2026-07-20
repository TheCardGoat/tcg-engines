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
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { st01GundamAerialPermetScoreSix006 } from "./006-gundam-aerial-permet-score-six.ts";

function nonLinkPilot() {
  return createMockPilot({
    name: "Academy Test Pilot",
    traits: ["academy"],
    level: 1,
    cost: 1,
    apBonus: 0,
    hpBonus: 0,
  });
}

describe("Gundam Aerial (Permet Score Six) (ST01-006)", () => {
  describe("Printed Lv.5 and cost 4", () => {
    it("cannot deploy with only 4 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st01GundamAerialPermetScoreSix006],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot deploy with fewer than 4 active Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 2 });
      const engine = GundamTestEngine.create({
        hand: [spender, st01GundamAerialPermetScoreSix006],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(spender));
      const aerialId = p1.getHand()[0]!;
      expectFailure(p1.deployUnit(aerialId), "INSUFFICIENT_RESOURCES");
      expect(p1.getHand()).toContain(aerialId);
    });

    it("deploys from hand to the battle area for 4 active Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st01GundamAerialPermetScoreSix006],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectSuccess(p1.deployUnit(cardId));

      expect(p1.getHand()).not.toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toContain(cardId);
      expect(p1.getCardZone(cardId)).toBe(`battleArea:${PLAYER_ONE}`);
    });
  });

  describe("【When Paired】Choose 1 enemy Unit that is Lv.5 or lower. It gets AP-3 during this turn.", () => {
    it("gives a chosen enemy Lv.5 Unit AP-3 when any Pilot is paired", () => {
      const pilot = nonLinkPilot();
      const enemy = createMockUnit({ ap: 5, hp: 5, level: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [st01GundamAerialPermetScoreSix006],
          resourceArea: activeResources(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const aerialId = p1.getCardsInZone("battleArea")[0]!;
      const pilotId = p1.getHand()[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilotId, aerialId));
      expect(p1.getPilotId(aerialId)).toBe(pilotId);
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: aerialId,
        legalTargetIds: [enemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(2);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("offers all and only enemy Units at Lv.5 or lower", () => {
      const pilot = nonLinkPilot();
      const lowEnemy = createMockUnit({ name: "Low Enemy", ap: 4, level: 4 });
      const boundaryEnemy = createMockUnit({ name: "Boundary Enemy", ap: 5, level: 5 });
      const highEnemy = createMockUnit({ name: "High Enemy", ap: 6, level: 6 });
      const friendly = createMockUnit({ name: "Friendly", ap: 3, level: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [st01GundamAerialPermetScoreSix006, friendly],
          resourceArea: activeResources(5),
        },
        { play: [lowEnemy, boundaryEnemy, highEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [aerialId, friendlyId] = p1.getCardsInZone("battleArea");
      const [lowId, boundaryId, highId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(pilot, aerialId!));

      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [lowId, boundaryId],
        minTargets: 1,
        maxTargets: 1,
      });
      expect(p1.getBoardView().pendingChoice).not.toMatchObject({
        legalTargetIds: expect.arrayContaining([friendlyId, highId]),
      });
    });

    it("rejects a friendly Lv.5 Unit as the target", () => {
      const pilot = nonLinkPilot();
      const friendly = createMockUnit({ ap: 4, level: 5 });
      const enemy = createMockUnit({ ap: 4, level: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [st01GundamAerialPermetScoreSix006, friendly],
          resourceArea: activeResources(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [aerialId, friendlyId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(pilot, aerialId!));
      expectFailure(p1.resolveEffect({ targets: [friendlyId!] }), "ILLEGAL_TARGET");

      expect(p1.getVisibleCard(friendlyId!)?.effectiveAp).toBe(4);
      expect(p1.getBoardView().pendingChoice).toMatchObject({ kind: "targetSelection" });
    });

    it("does not affect a Lv.6 enemy Unit when no legal target exists", () => {
      const pilot = nonLinkPilot();
      const enemy = createMockUnit({ ap: 5, hp: 5, level: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [st01GundamAerialPermetScoreSix006],
          resourceArea: activeResources(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const aerialId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, aerialId));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(5);
    });

    it("removes the AP penalty when this turn ends", () => {
      const pilot = nonLinkPilot();
      const enemy = createMockUnit({ ap: 5, hp: 5, level: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [st01GundamAerialPermetScoreSix006],
          resourceArea: activeResources(5),
          deck: 5,
        },
        { play: [enemy], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const aerialId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, aerialId));
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(2);

      passTurnThroughPublicMoves(engine, PLAYER_ONE);

      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(5);
    });

    it("does not trigger when a Pilot is paired with another friendly Unit", () => {
      const pilot = nonLinkPilot();
      const otherUnit = createMockUnit({ name: "Other Host" });
      const enemy = createMockUnit({ ap: 5, level: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [st01GundamAerialPermetScoreSix006, otherUnit],
          resourceArea: activeResources(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [, otherUnitId] = p1.getCardsInZone("battleArea");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, otherUnitId!));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(5);
    });
  });
});
