import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { gd03OverTheRiverAndThroughTheWoods107 } from "./107-over-the-river-and-through-the-woods.ts";

describe("Over the River and Through the Woods (GD03-107)", () => {
  describe("【Main】Choose 1 enemy Unit that is Lv.5 or lower. Deal damage to it equal to the number of friendly Unit tokens in play.", () => {
    it("deals damage equal to the number of friendly Unit tokens in play", () => {
      const tokenA = createMockUnit({ name: "Token A" });
      const tokenB = createMockUnit({ name: "Token B" });
      const nonToken = createMockUnit({ name: "Regular Unit" });
      const enemy = createMockUnit({ level: 5, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03OverTheRiverAndThroughTheWoods107],
          play: [tokenA, tokenB, nonToken],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
      const [tokenAId, tokenBId] = p1.getCardsInZone("battleArea");
      engine.markAsToken(tokenAId!);
      engine.markAsToken(tokenBId!);

      expectSuccess(p1.playCommand(gd03OverTheRiverAndThroughTheWoods107, { targets: [enemyId] }));

      expect(getDamageCounter(engine, enemyId)).toBe(2);
    });

    it("deals 0 damage when you control no Unit tokens", () => {
      const regularUnit = createMockUnit({ name: "Regular Unit" });
      const enemy = createMockUnit({ level: 5, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03OverTheRiverAndThroughTheWoods107],
          play: [regularUnit],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(gd03OverTheRiverAndThroughTheWoods107, { targets: [enemyId] }));

      expect(getDamageCounter(engine, enemyId)).toBe(0);
    });

    it("cannot target an enemy Unit above Lv.5", () => {
      const token = createMockUnit({ name: "Token" });
      const highLevelEnemy = createMockUnit({ level: 6, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03OverTheRiverAndThroughTheWoods107],
          play: [token],
          resourceArea: activeResources(4),
        },
        { play: [highLevelEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const tokenId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
      engine.markAsToken(tokenId);

      expectFailure(
        p1.playCommand(gd03OverTheRiverAndThroughTheWoods107, { targets: [enemyId] }),
        "INVALID_TARGET",
      );
    });
  });
});
