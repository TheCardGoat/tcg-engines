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
import { st05CgsMobileWorker003 } from "./003-cgs-mobile-worker.ts";

describe("CGS Mobile Worker (ST05-003)", () => {
  describe("【Activate･Main】Rest this Unit：Choose 1 of your Units. Deal 1 damage to it. It gets AP+1 during this turn.", () => {
    // The source Unit itself is always a legal friendly target while this ability can activate,
    // so there is no reachable no-legal-target branch.
    it("asks for one friendly Unit and applies both results to the selected physical card", () => {
      const firstAlly = createMockUnit({ name: "First Ally", ap: 2, hp: 5 });
      const secondAlly = createMockUnit({ name: "Second Ally", ap: 3, hp: 5 });
      const engine = GundamTestEngine.create({
        play: [st05CgsMobileWorker003, firstAlly, secondAlly],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [sourceId, firstAllyId, secondAllyId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.activateAbility(sourceId!, 0));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: sourceId,
        legalTargetIds: expect.arrayContaining([sourceId, firstAllyId, secondAllyId]),
        minTargets: 1,
        maxTargets: 1,
      });
      expectSuccess(p1.resolveEffect({ targets: [secondAllyId!] }));

      expect(p1.isExhausted(sourceId!)).toBe(true);
      expect(p1.getDamage(firstAllyId!)).toBe(0);
      expect(p1.getVisibleCard(firstAllyId!)?.effectiveAp).toBe(2);
      expect(p1.getDamage(secondAllyId!)).toBe(1);
      expect(p1.getVisibleCard(secondAllyId!)?.effectiveAp).toBe(4);
    });

    it("can choose CGS Mobile Worker itself", () => {
      const engine = GundamTestEngine.create({ play: [st05CgsMobileWorker003] });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const sourceId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.activateAbility(sourceId, 0, { targets: [sourceId] }));

      expect(p1.isExhausted(sourceId)).toBe(true);
      expect(p1.getDamage(sourceId)).toBe(1);
      expect(p1.getVisibleCard(sourceId)?.effectiveAp).toBe(1);
    });

    it("rejects an enemy Unit", () => {
      const enemy = createMockUnit({ name: "Enemy Unit", ap: 2, hp: 5 });
      const engine = GundamTestEngine.create({ play: [st05CgsMobileWorker003] }, { play: [enemy] });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const sourceId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.activateAbility(sourceId, 0, { targets: [enemyId] }), "ILLEGAL_TARGET");

      expect(p1.isExhausted(sourceId)).toBe(false);
      expect(p2.getDamage(enemyId)).toBe(0);
    });

    it("destroys a chosen friendly Unit with only 1 HP remaining", () => {
      const fragileAlly = createMockUnit({ name: "Fragile Ally", ap: 2, hp: 1 });
      const engine = GundamTestEngine.create({
        play: [st05CgsMobileWorker003, fragileAlly],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [sourceId, fragileAllyId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.activateAbility(sourceId!, 0, { targets: [fragileAllyId!] }));

      expect(p1.getCardZone(fragileAllyId!)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.isExhausted(sourceId!)).toBe(true);
    });

    it("removes the AP bonus at the end of the turn", () => {
      const ally = createMockUnit({ name: "Ally", ap: 2, hp: 5 });
      const engine = GundamTestEngine.create({ play: [st05CgsMobileWorker003, ally] });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [sourceId, allyId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.activateAbility(sourceId!, 0, { targets: [allyId!] }));
      expect(p1.getVisibleCard(allyId!)?.effectiveAp).toBe(3);

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());

      expect(p1.getVisibleCard(allyId!)?.effectiveAp).toBe(2);
      expect(p1.getDamage(allyId!)).toBe(1);
    });

    it("cannot pay the rest-self cost while already rested", () => {
      const engine = GundamTestEngine.create({
        play: [{ card: st05CgsMobileWorker003, exhausted: true }],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const sourceId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.activateAbility(sourceId, 0, { targets: [sourceId] }), "CARD_EXHAUSTED");

      expect(p1.getDamage(sourceId)).toBe(0);
    });

    it("cannot activate during a legally reached Action step", () => {
      const engine = GundamTestEngine.create({ play: [st05CgsMobileWorker003] });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const sourceId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(p1.activateAbility(sourceId, 0, { targets: [sourceId] }), "WRONG_PHASE");

      expect(p1.isExhausted(sourceId)).toBe(false);
    });
  });

  describe("playing CGS Mobile Worker", () => {
    it("pays 1 Resource and deploys it to the battle area", () => {
      const engine = GundamTestEngine.create({
        hand: [st05CgsMobileWorker003],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const sourceId = p1.getHand()[0]!;

      expectSuccess(p1.deployUnit(sourceId));

      expect(p1.getCardZone(sourceId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("resourceArea").every((id) => p1.isExhausted(id))).toBe(true);
    });

    it("cannot be deployed below its printed Lv.1 requirement", () => {
      const engine = GundamTestEngine.create({ hand: [st05CgsMobileWorker003] });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployUnit(st05CgsMobileWorker003), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(st05CgsMobileWorker003)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pay its printed cost without an active Resource", () => {
      const engine = GundamTestEngine.create({
        hand: [st05CgsMobileWorker003],
        resourceArea: restedResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployUnit(st05CgsMobileWorker003), "INSUFFICIENT_RESOURCES");
      expect(p1.getCardZone(st05CgsMobileWorker003)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be deployed during a legally reached Action step", () => {
      const engine = GundamTestEngine.create({
        hand: [st05CgsMobileWorker003],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(p1.deployUnit(st05CgsMobileWorker003), "WRONG_PHASE");

      expect(p1.getCardZone(st05CgsMobileWorker003)).toBe(`hand:${PLAYER_ONE}`);
    });
  });
});
