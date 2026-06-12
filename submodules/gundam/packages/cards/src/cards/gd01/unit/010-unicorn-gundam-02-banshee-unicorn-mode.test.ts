import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01UnicornGundam02BansheeUnicornMode010 } from "./010-unicorn-gundam-02-banshee-unicorn-mode.ts";

describe("Unicorn Gundam 02 Banshee (Unicorn Mode) (GD01-010)", () => {
  describe("【When Paired】Choose 1 enemy Unit with 3 or less HP. Rest it.", () => {
    it("rests a chosen 3-HP enemy on pairing", () => {
      const pilot = createMockPilot({ level: 1, cost: 1 });
      const enemy = createMockUnit({ ap: 2, hp: 3 });
      const engine = GundamTestEngine.create(
        {
          play: [gd01UnicornGundam02BansheeUnicornMode010],
          hand: [pilot],
          resourceArea: activeResources(3),
          deck: 5,
        },
        { play: [enemy], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, gd01UnicornGundam02BansheeUnicornMode010));
      const pending = engine.getPendingChoice();
      if (pending) {
        expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
      }
      expect(p1.isExhausted(enemyId)).toBe(true);
    });

    it("does not rest an enemy with 4+ HP (no legal target)", () => {
      const pilot = createMockPilot({ level: 1, cost: 1 });
      const tough = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          play: [gd01UnicornGundam02BansheeUnicornMode010],
          hand: [pilot],
          resourceArea: activeResources(3),
          deck: 5,
        },
        { play: [tough], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const toughId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, gd01UnicornGundam02BansheeUnicornMode010));
      expect(p1.isExhausted(toughId)).toBe(false);
    });
  });
});
