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
  });
});
