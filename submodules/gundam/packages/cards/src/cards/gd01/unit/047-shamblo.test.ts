import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { gd01Shamblo047 } from "./047-shamblo.ts";

describe("Shamblo (GD01-047)", () => {
  it("【Attack】 deals 3 damage to an enemy Unit when 2+ other rested friendly Units are in play", () => {
    const ally1 = createMockUnit({ ap: 1, hp: 3 });
    const ally2 = createMockUnit({ ap: 1, hp: 3 });
    // Single enemy unit: serves as both combat target and dealDamage target.
    const enemy = createMockUnit({ ap: 1, hp: 10, level: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd01Shamblo047, ally1, ally2] },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const shambloId = p1.getCardsInZone("battleArea")[0]!;
    const [enemyId] = p2.getCardsInZone("battleArea");

    // Rest the two allies so the "2+ other rested" condition is met.
    const allyIds = p1.getCardsInZone("battleArea").slice(1);
    for (const id of allyIds) {
      engine.getG().exhausted[id] = true;
    }

    engine.resolveCombat({ attackerId: shambloId, target: enemyId! });

    // Shamblo AP 6 deals combat damage; attack trigger also deals 3 effect damage.
    // Total damage on enemy = 6 (combat) + 3 (trigger) = 9.
    expect(getDamageCounter(engine, enemyId!)).toBe(9);
  });

  it("【Attack】 does NOT fire when fewer than 2 other rested friendly Units in play", () => {
    const ally1 = createMockUnit({ ap: 1, hp: 3 });
    const enemy = createMockUnit({ ap: 1, hp: 10, level: 5 });
    const engine = GundamTestEngine.create({ play: [gd01Shamblo047, ally1] }, { play: [enemy] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const shambloId = p1.getCardsInZone("battleArea")[0]!;
    const [enemyId] = p2.getCardsInZone("battleArea");

    // Rest the single ally — only 1, need 2+ for condition.
    const allyId = p1.getCardsInZone("battleArea")[1]!;
    engine.getG().exhausted[allyId] = true;

    engine.resolveCombat({ attackerId: shambloId, target: enemyId! });

    // Only combat damage (6), no trigger damage.
    expect(getDamageCounter(engine, enemyId!)).toBe(6);
  });
});
