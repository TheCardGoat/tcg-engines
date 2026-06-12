import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01UnicornGundamDestroyMode002 } from "./002-unicorn-gundam-destroy-mode.ts";

describe("Unicorn Gundam (Destroy Mode) (GD01-002)", () => {
  describe("【Attack】Choose 1 enemy Unit. Rest it.", () => {
    it("rests a chosen enemy Unit when Unicorn Gundam attacks", () => {
      const enemy = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [gd01UnicornGundamDestroyMode002] },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unicornId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(unicornId, enemyId));
      if (engine.getPendingChoice()) {
        expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
      }

      expect(p2.isExhausted(enemyId)).toBe(true);
    });

    it("rests an enemy Unit even when attacking directly", () => {
      const enemy = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [gd01UnicornGundamDestroyMode002] },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unicornId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(unicornId, "direct"));

      expect(p2.isExhausted(enemyId)).toBe(true);
    });

    it("rests only enemy Units, not friendly Units", () => {
      const ally = createMockUnit({ ap: 2, hp: 5 });
      const enemy = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [gd01UnicornGundamDestroyMode002, ally] },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [unicornId, allyId] = p1.getCardsInZone("battleArea");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(unicornId!, enemyId));

      expect(p1.isExhausted(allyId!)).toBe(false);
      expect(p2.isExhausted(enemyId)).toBe(true);
    });

    it("does not create a target prompt when the opponent has no Units", () => {
      const engine = GundamTestEngine.create({ play: [gd01UnicornGundamDestroyMode002] }, {});
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unicornId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(unicornId, "direct"));

      expect(engine.getPendingChoice()).toBeUndefined();
    });
  });
});
