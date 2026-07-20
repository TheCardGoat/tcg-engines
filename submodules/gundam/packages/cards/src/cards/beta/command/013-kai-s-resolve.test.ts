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
import { betaKaiSResolve013 } from "./013-kai-s-resolve.ts";

describe("Kai's Resolve (ST01-013)", () => {
  describe("【Main】Choose 1 friendly Unit. It recovers 3 HP.", () => {
    it("recovers 3 HP from battle damage and moves the resolved Command to trash", () => {
      const friendly = createMockUnit({ name: "Friendly Unit", ap: 0, hp: 10 });
      const enemy = createMockUnit({ name: "Enemy Unit", ap: 5, hp: 10 });
      const engine = GundamTestEngine.create(
        {
          hand: [betaKaiSResolve013],
          play: [friendly],
          resourceArea: activeResources(3),
        },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.enterBattle(friendlyId, enemyId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expect(p1.getDamage(friendlyId)).toBe(5);

      expectSuccess(p1.playCommand(commandId, { targets: [friendlyId] }));

      expect(p1.getDamage(friendlyId)).toBe(2);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("removes all damage when the Unit has fewer than 3 damage counters", () => {
      const friendly = createMockUnit({ name: "Friendly Unit", ap: 0, hp: 10 });
      const enemy = createMockUnit({ name: "Enemy Unit", ap: 2, hp: 10 });
      const engine = GundamTestEngine.create(
        {
          hand: [betaKaiSResolve013],
          play: [friendly],
          resourceArea: activeResources(3),
        },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(friendlyId, enemyId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expect(p1.getDamage(friendlyId)).toBe(2);

      expectSuccess(p1.playCommand(betaKaiSResolve013, { targets: [friendlyId] }));

      expect(p1.getDamage(friendlyId)).toBe(0);
      expect(p1.getVisibleCard(friendlyId)?.effectiveHp).toBe(10);
    });

    it("can choose an undamaged friendly Unit and resolves without increasing its HP", () => {
      const friendly = createMockUnit({ name: "Friendly Unit", ap: 2, hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [betaKaiSResolve013],
        play: [friendly],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(commandId, { targets: [friendlyId] }));

      expect(p1.getDamage(friendlyId)).toBe(0);
      expect(p1.getVisibleCard(friendlyId)?.effectiveHp).toBe(5);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("rejects an enemy Unit", () => {
      const friendly = createMockUnit({ name: "Friendly Unit", hp: 5 });
      const enemy = createMockUnit({ name: "Enemy Unit", hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [betaKaiSResolve013],
          play: [friendly],
          resourceArea: activeResources(3),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.playCommand(betaKaiSResolve013, { targets: [enemyId] }), "INVALID_TARGET");

      expect(p1.getCardZone(betaKaiSResolve013)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be played when no friendly Unit can be chosen", () => {
      const enemy = createMockUnit({ name: "Enemy Unit", hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [betaKaiSResolve013], resourceArea: activeResources(3) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(betaKaiSResolve013), "NO_LEGAL_TARGETS");

      expect(p1.getCardZone(betaKaiSResolve013)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be played during a legally reached Action step", () => {
      const friendly = createMockUnit({ name: "Friendly Unit", hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [betaKaiSResolve013],
        play: [friendly],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(p1.playCommand(betaKaiSResolve013), "WRONG_TIMING");

      expect(p1.getCardZone(betaKaiSResolve013)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be played below its printed Lv.3 requirement", () => {
      const friendly = createMockUnit({ name: "Friendly Unit", hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [betaKaiSResolve013],
        play: [friendly],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(betaKaiSResolve013), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getCardZone(betaKaiSResolve013)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pay its printed cost without an active Resource", () => {
      const friendly = createMockUnit({ name: "Friendly Unit", hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [betaKaiSResolve013],
        play: [friendly],
        resourceArea: restedResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(betaKaiSResolve013), "INSUFFICIENT_RESOURCES");

      expect(p1.getCardZone(betaKaiSResolve013)).toBe(`hand:${PLAYER_ONE}`);
    });
  });

  describe("【Pilot】[Kai Shiden]", () => {
    it("can be played as Kai Shiden and grants AP+1/HP+0 to the paired Unit", () => {
      const host = createMockUnit({ name: "Host", ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [betaKaiSResolve013],
        play: [host],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.playCommandAsPilot(commandId, hostId));

      expect(p1.getPilotId(hostId)).toBe(commandId);
      expect(p1.getCardZone(commandId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 3, effectiveHp: 3 });
    });
  });
});
