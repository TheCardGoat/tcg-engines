import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04SwordImpulseGundam056 } from "./056-sword-impulse-gundam.ts";

describe("Sword Impulse Gundam (GD04-056)", () => {
  describe("【Deploy】Deal 1 damage to this Unit. If you do, choose 1 enemy Unit with 3 or less AP. Rest it.", () => {
    it("damages itself and rests the chosen eligible enemy Unit", () => {
      const lowAp = createMockUnit({ ap: 2, hp: 5 });
      const highAp = createMockUnit({ ap: 5, hp: 5 });

      const engine = GundamTestEngine.create(
        {
          hand: [gd04SwordImpulseGundam056],
          resourceArea: activeResources(4),
        },
        { play: [lowAp, highAp] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [lowApId, highApId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.deployUnit(gd04SwordImpulseGundam056, { targets: [lowApId!] }));

      const swordImpulseId = p1.getCardsInZone("battleArea")[0]!;
      expect(p1.getDamage(swordImpulseId)).toBe(1);
      expect(p2.isExhausted(lowApId!)).toBe(true);
      expect(p2.isExhausted(highApId!)).toBe(false);
    });

    it("rejects an enemy Unit whose visible AP is higher than 3", () => {
      const highAp = createMockUnit({ ap: 4, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04SwordImpulseGundam056],
          resourceArea: activeResources(4),
        },
        { play: [highAp] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const highApId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.deployUnit(gd04SwordImpulseGundam056, { targets: [highApId] }),
        "INVALID_TARGET",
      );

      expect(p1.getCardZone(gd04SwordImpulseGundam056)).toBe(`hand:${PLAYER_ONE}`);
      expect(engine.asPlayer(PLAYER_TWO).isExhausted(highApId)).toBe(false);
    });
  });
});
