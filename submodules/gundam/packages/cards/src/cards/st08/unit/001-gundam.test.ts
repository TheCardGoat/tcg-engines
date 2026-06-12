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
import { st08Gundam001 } from "./001-gundam.ts";

describe("Ξ Gundam (ST08-001)", () => {
  describe("While you have no Units that are Lv.6 or higher in play, this card in your hand gets Lv. -1 and cost -1 for each enemy Unit in play.", () => {
    it("reduces its hand level and cost by the number of enemy Units in play", () => {
      const enemyA = createMockUnit({ cardNumber: "TEST-XI-ENEMY-A" });
      const enemyB = createMockUnit({ cardNumber: "TEST-XI-ENEMY-B" });
      const engine = GundamTestEngine.create(
        { hand: [st08Gundam001], resourceArea: activeResources(7) },
        { play: [enemyA, enemyB] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(st08Gundam001));

      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(6);
    });

    it("does not reduce while you have a friendly Lv.6 or higher Unit in play", () => {
      const highLevelFriendly = createMockUnit({
        cardNumber: "TEST-XI-FRIEND-L6",
        level: 6,
      });
      const enemyA = createMockUnit({ cardNumber: "TEST-XI-ENEMY-C" });
      const enemyB = createMockUnit({ cardNumber: "TEST-XI-ENEMY-D" });
      const engine = GundamTestEngine.create(
        {
          hand: [st08Gundam001],
          play: [highLevelFriendly],
          resourceArea: activeResources(7),
        },
        { play: [enemyA, enemyB] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployUnit(st08Gundam001), "INSUFFICIENT_RESOURCE_LEVEL");
    });

    it("does not reduce when there are no enemy Units in play", () => {
      const engine = GundamTestEngine.create({
        hand: [st08Gundam001],
        resourceArea: activeResources(8),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployUnit(st08Gundam001), "INSUFFICIENT_RESOURCE_LEVEL");
    });

    it("does not count enemy Units outside the battle area for hand reductions", () => {
      const enemyHandUnit = createMockUnit({ cardNumber: "TEST-XI-ENEMY-HAND" });
      const enemyTrashUnit = createMockUnit({ cardNumber: "TEST-XI-ENEMY-TRASH" });
      const engine = GundamTestEngine.create(
        { hand: [st08Gundam001], resourceArea: activeResources(8) },
        { hand: [enemyHandUnit], trash: [enemyTrashUnit] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployUnit(st08Gundam001), "INSUFFICIENT_RESOURCE_LEVEL");
    });
  });

  describe("【When Paired】Choose 1 enemy Unit with the highest Lv. Deal 3 damage to it.", () => {
    it("deals 3 damage to the highest-level enemy Unit when paired", () => {
      const hathaway = createMockPilot({ name: "Hathaway Noa", level: 1, cost: 1 });
      const lowLevelEnemy = createMockUnit({
        cardNumber: "TEST-XI-LOW",
        level: 3,
        hp: 6,
      });
      const highLevelEnemy = createMockUnit({
        cardNumber: "TEST-XI-HIGH",
        level: 7,
        hp: 6,
      });
      const engine = GundamTestEngine.create(
        {
          hand: [hathaway],
          play: [st08Gundam001],
          resourceArea: activeResources(1),
        },
        { play: [lowLevelEnemy, highLevelEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [lowLevelId, highLevelId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(hathaway, st08Gundam001));

      expect(p2.getDamage(highLevelId!)).toBe(3);
      expect(p2.getDamage(lowLevelId!)).toBe(0);
    });

    it("does not deal damage when the opponent controls no Units", () => {
      const hathaway = createMockPilot({ name: "Hathaway Noa", level: 1, cost: 1 });
      const engine = GundamTestEngine.create({
        hand: [hathaway],
        play: [st08Gundam001],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.assignPilot(hathaway, st08Gundam001));

      expect(engine.getPendingChoice()).toBeUndefined();
      expect(p1.getPilotId(p1.getCardsInZone("battleArea")[0]!)).toBeDefined();
    });
  });
});
