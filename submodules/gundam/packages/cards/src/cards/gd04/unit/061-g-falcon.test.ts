import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04GFalcon061 } from "./061-g-falcon.ts";

describe("G-Falcon (GD04-061)", () => {
  describe("This Unit can't attack while there are 6 or less cards in your trash.", () => {
    it("does not offer an attack and rejects an attempted attack with 6 trash cards", () => {
      const engine = GundamTestEngine.create({
        play: [gd04GFalcon061],
        trash: Array.from({ length: 6 }, (_, index) => createMockUnit({ name: `Trash ${index}` })),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const gFalconId = p1.getCardsInZone("battleArea")[0]!;

      expect(p1.getLegalAttackTargets(gFalconId)).toHaveLength(0);
      expectFailure(p1.enterBattle(gFalconId, "direct"), "CANNOT_ATTACK");
    });

    it("offers and accepts an attack once there are 7 trash cards", () => {
      const engine = GundamTestEngine.create({
        play: [gd04GFalcon061],
        trash: Array.from({ length: 7 }, (_, index) => createMockUnit({ name: `Trash ${index}` })),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const gFalconId = p1.getCardsInZone("battleArea")[0]!;

      expect(p1.getLegalAttackTargets(gFalconId)).toContain("direct");
      expectSuccess(p1.enterBattle(gFalconId, "direct"));
    });
  });

  describe("<Blocker>", () => {
    it("redirects an attack from another friendly Unit to G-Falcon", () => {
      const attacker = createMockUnit({ ap: 3, hp: 5 });
      const defender = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: defender, exhausted: true }, gd04GFalcon061] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const [defenderId, blockerId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(attackerId, defenderId!));
      expectSuccess(p2.declareBlock(blockerId!));
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getCardZone(blockerId!)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getCardZone(defenderId!)).toBe(`battleArea:${PLAYER_TWO}`);
      expect(p2.getDamage(defenderId!)).toBe(0);
      expect(p1.getDamage(attackerId)).toBe(3);
    });
  });
});
