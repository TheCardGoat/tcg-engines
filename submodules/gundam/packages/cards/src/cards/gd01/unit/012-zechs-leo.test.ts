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
import { gd01ZechsLeo012 } from "./012-zechs-leo.ts";

describe("Zechs' Leo (GD01-012)", () => {
  describe("【When Paired】Choose 1 enemy Unit with 3 or less HP. Rest it.", () => {
    it("rests a chosen ≤3 HP enemy on pairing", () => {
      const pilot = createMockPilot({ level: 1, cost: 1 });
      const enemy = createMockUnit({ ap: 2, hp: 3 });
      const engine = GundamTestEngine.create(
        {
          play: [gd01ZechsLeo012],
          hand: [pilot],
          resourceArea: activeResources(3),
          deck: 5,
        },
        { play: [enemy], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, gd01ZechsLeo012));
      const pending = engine.getPendingChoice();
      if (pending) {
        expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
      }
      expect(p1.isExhausted(enemyId)).toBe(true);
    });
  });
});
