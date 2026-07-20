import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { st08LadyLuck013 } from "./013-lady-luck.ts";

describe("Lady Luck (ST08-013)", () => {
  describe("【Main】/【Action】Choose 1 enemy Unit. Deal 1 damage to it. If a friendly (Mafty) Link Unit is in play, deal 2 damage instead.", () => {
    it("deals 1 damage without a friendly Mafty Link Unit", () => {
      const enemy = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st08LadyLuck013], resourceArea: activeResources(5) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(st08LadyLuck013, { targets: [enemyId!] }));

      expect(p2.getDamage(enemyId!)).toBe(1);
    });

    it("publishes an exact-one controller/source enemy choice", () => {
      const engine = GundamTestEngine.create(
        { hand: [st08LadyLuck013], play: [createMockUnit()], resourceArea: activeResources(5) },
        { play: [createMockUnit({ hp: 5 }), createMockUnit({ hp: 5 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const commandId = p1.getHand()[0]!;
      const enemies = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");
      expectSuccess(p1.playCommand(commandId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        controllerId: PLAYER_ONE,
        sourceCardId: commandId,
        minTargets: 1,
        maxTargets: 1,
        legalTargetIds: enemies,
      });
      expectSuccess(p1.resolveEffect({ targets: [enemies[0]!] }));
      expect(p1.getDamage(enemies[0]!)).toBe(1);
      expect(p1.getDamage(enemies[1]!)).toBe(0);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("deals 2 damage while a friendly Mafty Link Unit is in play", () => {
      const pilot = createMockPilot({ name: "Mafty Pilot", level: 1, cost: 1 });
      const maftyLink = createMockUnit({
        traits: ["mafty"],
        ap: 3,
        hp: 5,
        linkCondition: "[Mafty Pilot]",
      });
      const enemy = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot, st08LadyLuck013],
          play: [maftyLink],
          resourceArea: activeResources(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [maftyId] = p1.getCardsInZone("battleArea");
      const [enemyId] = p2.getCardsInZone("battleArea");
      expectSuccess(p1.assignPilot(pilot, maftyId!));

      expectSuccess(p1.playCommand(st08LadyLuck013, { targets: [enemyId!] }));

      expect(p2.getDamage(enemyId!)).toBe(2);
    });

    it("does not qualify an unlinked friendly Mafty Unit", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [st08LadyLuck013],
          play: [createMockUnit({ traits: ["mafty"] })],
          resourceArea: activeResources(5),
        },
        { play: [createMockUnit({ hp: 5 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.playCommand(st08LadyLuck013, { targets: [enemyId] }));
      expect(p1.getDamage(enemyId)).toBe(1);
    });

    it("does not qualify a linked friendly Unit without Mafty", () => {
      const pilot = createMockPilot({ name: "Pilot" });
      const host = createMockUnit({ traits: ["zeon"], linkCondition: "[Pilot]" });
      const engine = GundamTestEngine.create(
        { hand: [pilot, st08LadyLuck013], play: [host], resourceArea: activeResources(5) },
        { play: [createMockUnit({ hp: 5 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(pilot, p1.getCardsInZone("battleArea")[0]!));
      expectSuccess(p1.playCommand(st08LadyLuck013, { targets: [enemyId] }));
      expect(p1.getDamage(enemyId)).toBe(1);
    });

    it("also works at action timing", () => {
      const attacker = createMockUnit({ ap: 1, hp: 5 });
      const enemy = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st08LadyLuck013],
          play: [attacker],
          resourceArea: activeResources(5),
        },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [attackerId] = p1.getCardsInZone("battleArea");
      const [enemyId] = p2.getCardsInZone("battleArea");
      expectSuccess(p1.enterBattle(attackerId!, enemyId!));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());

      expectSuccess(p1.playCommand(st08LadyLuck013, { targets: [enemyId!] }));

      expect(p2.getDamage(enemyId!)).toBe(1);
    });

    it("rejects a friendly Unit target", () => {
      const friendly = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [st08LadyLuck013],
        play: [friendly],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [friendlyId] = p1.getCardsInZone("battleArea");

      expectFailure(p1.playCommand(st08LadyLuck013, { targets: [friendlyId!] }), "INVALID_TARGET");
    });

    it("cannot be played without an enemy Unit", () => {
      const engine = GundamTestEngine.create({
        hand: [st08LadyLuck013],
        resourceArea: activeResources(5),
      });
      expectFailure(engine.asPlayer(PLAYER_ONE).playCommand(st08LadyLuck013), "NO_LEGAL_TARGETS");
    });

    it("destroys a two-HP enemy with the replacement damage, not three damage", () => {
      const pilot = createMockPilot({ name: "Pilot" });
      const host = createMockUnit({ traits: ["mafty"], linkCondition: "[Pilot]" });
      const engine = GundamTestEngine.create(
        { hand: [pilot, st08LadyLuck013], play: [host], resourceArea: activeResources(5) },
        { play: [createMockUnit({ hp: 2 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(pilot, p1.getCardsInZone("battleArea")[0]!));
      expectSuccess(p1.playCommand(st08LadyLuck013, { targets: [enemyId] }));
      expect(p1.getCardZone(enemyId)).toBe(`trash:${PLAYER_TWO}`);
    });
  });

  it("requires Lv.5", () => {
    const engine = GundamTestEngine.create(
      { hand: [st08LadyLuck013], resourceArea: activeResources(4) },
      { play: [createMockUnit()] },
    );
    expectFailure(
      engine.asPlayer(PLAYER_ONE).playCommand(st08LadyLuck013),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
  });

  it("requires one active resource", () => {
    const engine = GundamTestEngine.create(
      { hand: [st08LadyLuck013], resourceArea: restedResources(5) },
      { play: [createMockUnit()] },
    );
    expectFailure(
      engine.asPlayer(PLAYER_ONE).playCommand(st08LadyLuck013),
      "INSUFFICIENT_RESOURCES",
    );
  });
});
