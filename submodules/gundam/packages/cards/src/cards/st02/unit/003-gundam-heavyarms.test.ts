import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { st02GundamHeavyarms003 } from "./003-gundam-heavyarms.ts";

describe("Gundam Heavyarms (ST02-003)", () => {
  describe("【During Pair】During your turn, when this Unit destroys an enemy Unit with battle damage, deal 1 damage to all enemy Units that are Lv.3 or lower.", () => {
    it("deals 1 damage to every Lv.3-or-lower enemy after paired Heavyarms destroys a Unit in battle", () => {
      const pilot = createMockPilot({
        name: "Trowa Barton",
        level: 1,
        cost: 1,
        apBonus: 0,
        hpBonus: 0,
      });
      const defender = createMockUnit({ name: "Defender", ap: 1, hp: 1, level: 1 });
      const levelTwoEnemy = createMockUnit({ name: "Lv.2 Enemy", ap: 1, hp: 4, level: 2 });
      const levelThreeEnemy = createMockUnit({ name: "Lv.3 Enemy", ap: 1, hp: 4, level: 3 });
      const levelFourEnemy = createMockUnit({ name: "Lv.4 Enemy", ap: 1, hp: 4, level: 4 });
      const friendlyUnit = createMockUnit({ name: "Friendly Unit", ap: 1, hp: 4, level: 2 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [st02GundamHeavyarms003, friendlyUnit],
          resourceArea: activeResources(1),
        },
        {
          play: [
            { card: defender, exhausted: true },
            levelTwoEnemy,
            levelThreeEnemy,
            levelFourEnemy,
          ],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [heavyarmsId, friendlyUnitId] = p1.getCardsInZone("battleArea");
      const [defenderId, levelTwoId, levelThreeId, levelFourId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(pilot, heavyarmsId!));
      expectSuccess(p1.enterBattle(heavyarmsId!, defenderId!));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getCardZone(defenderId!)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getDamage(levelTwoId!)).toBe(1);
      expect(p2.getDamage(levelThreeId!)).toBe(1);
      expect(p2.getDamage(levelFourId!)).toBe(0);
      expect(p1.getDamage(friendlyUnitId!)).toBe(0);
    });

    it("does not activate while Heavyarms is not paired", () => {
      const defender = createMockUnit({ name: "Defender", ap: 1, hp: 1, level: 1 });
      const lowLevelEnemy = createMockUnit({ name: "Low-level Enemy", ap: 1, hp: 4, level: 3 });
      const engine = GundamTestEngine.create(
        { play: [st02GundamHeavyarms003] },
        { play: [{ card: defender, exhausted: true }, lowLevelEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const heavyarmsId = p1.getCardsInZone("battleArea")[0]!;
      const [defenderId, lowLevelEnemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(heavyarmsId, defenderId!));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getCardZone(defenderId!)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getDamage(lowLevelEnemyId!)).toBe(0);
    });

    it("does not activate when the enemy Unit survives Heavyarms' battle damage", () => {
      const pilot = createMockPilot({
        name: "Trowa Barton",
        level: 1,
        cost: 1,
        apBonus: 0,
        hpBonus: 0,
      });
      const defender = createMockUnit({ name: "Surviving Defender", ap: 1, hp: 5, level: 1 });
      const lowLevelEnemy = createMockUnit({ name: "Low-level Enemy", ap: 1, hp: 4, level: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [st02GundamHeavyarms003],
          resourceArea: activeResources(1),
        },
        { play: [{ card: defender, exhausted: true }, lowLevelEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const heavyarmsId = p1.getCardsInZone("battleArea")[0]!;
      const [defenderId, lowLevelEnemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(pilot, heavyarmsId));
      expectSuccess(p1.enterBattle(heavyarmsId, defenderId!));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getCardZone(defenderId!)).toBe(`battleArea:${PLAYER_TWO}`);
      expect(p2.getDamage(defenderId!)).toBe(3);
      expect(p2.getDamage(lowLevelEnemyId!)).toBe(0);
    });

    it("still resolves after Heavyarms and the defender destroy each other simultaneously", () => {
      const fragileHeavyarms = { ...st02GundamHeavyarms003, hp: 1 };
      const pilot = createMockPilot({
        name: "Trowa Barton",
        level: 1,
        cost: 1,
        apBonus: 0,
        hpBonus: 0,
      });
      const defender = createMockUnit({ name: "Defender", ap: 1, hp: 1, level: 1 });
      const lowLevelEnemy = createMockUnit({ name: "Low-level Enemy", ap: 1, hp: 4, level: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [fragileHeavyarms],
          resourceArea: activeResources(1),
        },
        { play: [{ card: defender, exhausted: true }, lowLevelEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const heavyarmsId = p1.getCardsInZone("battleArea")[0]!;
      const [defenderId, lowLevelEnemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(pilot, heavyarmsId));
      expectSuccess(p1.enterBattle(heavyarmsId, defenderId!));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p1.getCardZone(heavyarmsId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p2.getCardZone(defenderId!)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getDamage(lowLevelEnemyId!)).toBe(1);
    });
  });
});
