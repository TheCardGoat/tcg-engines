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
import { gd01Guncannon004 } from "./004-guncannon.ts";

describe("Guncannon (GD01-004)", () => {
  it("<Repair 1> heals 1 damage at end of its controller's turn", () => {
    const engine = GundamTestEngine.create({
      play: [{ card: gd01Guncannon004, damage: 2 }],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    // TestCardEntry.damage lands on meta — mirror it into G.damage so
    // Repair has something to heal.
    engine.getG().damage[unitId] = 2;

    engine.endTurn();

    expect(engine.getG().damage[unitId]).toBe(1);
  });

  describe("【When Paired】Choose 1 enemy Unit with 2 or less HP. Rest it.", () => {
    it("rests a chosen 2-HP enemy when a pilot is paired", () => {
      const pilot = createMockPilot({ level: 1, cost: 1 });
      const enemy = createMockUnit({ ap: 1, hp: 2 });
      const engine = GundamTestEngine.create(
        {
          play: [gd01Guncannon004],
          hand: [pilot],
          resourceArea: activeResources(3),
          deck: 5,
        },
        { play: [enemy], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, unitId));

      // 【When Paired】 auto-picks the only legal target; triggered
      // target filters do not halt (only optional directives always do).
      const pending = engine.getPendingChoice();
      if (pending) {
        expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
      }

      expect(p1.isExhausted(enemyId)).toBe(true);
    });

    it("does not rest an enemy with more than 2 HP", () => {
      const pilot = createMockPilot({ level: 1, cost: 1 });
      const tough = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          play: [gd01Guncannon004],
          hand: [pilot],
          resourceArea: activeResources(3),
          deck: 5,
        },
        { play: [tough], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const toughId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, gd01Guncannon004));
      // No legal targets → no halt, no rest.
      expect(p1.isExhausted(toughId)).toBe(false);
    });
  });
});
