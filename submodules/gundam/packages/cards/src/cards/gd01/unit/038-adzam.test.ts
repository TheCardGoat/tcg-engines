import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01Adzam038 } from "./038-adzam.ts";

describe("Adzam (GD01-038)", () => {
  describe("【Deploy】If 5 or more enemy Units are in play, deal 1 damage to all enemy Units.", () => {
    it("deals 1 damage to every enemy Unit when ≥5 enemies are in play", () => {
      const enemies = Array.from({ length: 5 }, () => createMockUnit({ ap: 1, hp: 3 }));
      const engine = GundamTestEngine.create(
        { hand: [gd01Adzam038], resourceArea: activeResources(7), deck: 5 },
        { play: enemies, deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyIds = p2.getCardsInZone("battleArea");

      expectSuccess(p1.deployUnit(gd01Adzam038));

      for (const id of enemyIds) {
        expect(p1.getDamage(id)).toBe(1);
      }
    });

    it("does not deal damage when fewer than 5 enemies are in play", () => {
      const enemies = Array.from({ length: 4 }, () => createMockUnit({ ap: 1, hp: 3 }));
      const engine = GundamTestEngine.create(
        { hand: [gd01Adzam038], resourceArea: activeResources(7), deck: 5 },
        { play: enemies, deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyIds = p2.getCardsInZone("battleArea");

      expectSuccess(p1.deployUnit(gd01Adzam038));

      for (const id of enemyIds) {
        expect(p1.getDamage(id)).toBe(0);
      }
    });
  });
});
