import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectCardInTrash,
  expectFailure,
  expectSuccess,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { gd04ReliableBigBrother116 } from "./116-reliable-big-brother.ts";

describe("Reliable Big Brother (GD04-116)", () => {
  describe("【Main】Place the top 2 cards of your deck into your trash. If you do, choose 1 enemy Unit with 4 or less AP. Deal an amount of damage equal to the number of (Minerva Squad) cards placed with this effect to that enemy Unit.", () => {
    it("mills 2 cards and deals 2 damage when both milled cards are Minerva Squad cards", () => {
      const minervaA = createMockUnit({ traits: ["minerva squad"] });
      const minervaB = createMockUnit({ traits: ["minerva squad"] });
      const enemy = createMockUnit({ ap: 4, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04ReliableBigBrother116],
          resourceArea: activeResources(4),
          deck: [minervaA, minervaB],
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd04ReliableBigBrother116, { targets: [enemyId] }));

      expect(getDamageCounter(engine, enemyId)).toBe(2);
      expect(p1.getCardsInZone("deck")).toHaveLength(0);
      expect(p1.getCardsInZone("trash")).toHaveLength(3);
      expectCardInTrash(engine, commandId, PLAYER_ONE);
    });

    it("deals damage equal to only the milled Minerva Squad count", () => {
      const minerva = createMockUnit({ traits: ["minerva squad"] });
      const nonMinerva = createMockUnit({ traits: ["zaft"] });
      const enemy = createMockUnit({ ap: 4, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04ReliableBigBrother116],
          resourceArea: activeResources(4),
          deck: [minerva, nonMinerva],
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(gd04ReliableBigBrother116, { targets: [enemyId] }));

      expect(getDamageCounter(engine, enemyId)).toBe(1);
      expect(p1.getCardsInZone("deck")).toHaveLength(0);
      expect(p1.getCardsInZone("trash")).toHaveLength(3);
    });

    it("mills the cards but deals no damage when no milled cards are Minerva Squad cards", () => {
      const nonMinervaA = createMockUnit({ traits: ["zaft"] });
      const nonMinervaB = createMockUnit({ traits: ["coordinator"] });
      const enemy = createMockUnit({ ap: 4, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04ReliableBigBrother116],
          resourceArea: activeResources(4),
          deck: [nonMinervaA, nonMinervaB],
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(gd04ReliableBigBrother116, { targets: [enemyId] }));

      expect(getDamageCounter(engine, enemyId)).toBe(0);
      expect(p1.getCardsInZone("deck")).toHaveLength(0);
      expect(p1.getCardsInZone("trash")).toHaveLength(3);
    });

    it("cannot target an enemy Unit with more than 4 AP", () => {
      const minerva = createMockUnit({ traits: ["minerva squad"] });
      const toughEnemy = createMockUnit({ ap: 5, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04ReliableBigBrother116],
          resourceArea: activeResources(4),
          deck: [minerva, minerva],
        },
        { play: [toughEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.playCommand(gd04ReliableBigBrother116, { targets: [enemyId] }),
        "INVALID_TARGET",
      );
      expect(getDamageCounter(engine, enemyId)).toBe(0);
      expect(p1.getCardsInZone("deck")).toHaveLength(2);
    });
  });
});
