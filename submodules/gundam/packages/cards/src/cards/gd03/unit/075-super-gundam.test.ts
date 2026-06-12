import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  findStatModifier,
  markAsLinkUnit,
} from "@tcg/gundam-engine";
import { gd03SuperGundam075 } from "./075-super-gundam.ts";

describe("Super Gundam (GD03-075)", () => {
  // The `attack` trigger is gated by `duringLink`. The new `paired:false` AttributeFilter
  // restricts the AP-2 target to enemy Units with no paired Pilot. The
  // `(AEUG) Trait` link condition is honored by the trait-aware
  // `satisfiesLinkCondition` engine fix shipped in this commit.
  it("【During Link】【Attack】 picks an enemy Unit with no paired Pilot for AP-2", () => {
    const pairedEnemy = createMockUnit({ ap: 4, hp: 5 });
    const unpairedEnemy = createMockUnit({ ap: 4, hp: 5 });

    const engine = GundamTestEngine.create(
      { play: [gd03SuperGundam075] },
      { play: [pairedEnemy, unpairedEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const [pairedEnemyId, unpairedEnemyId] = p2.getCardsInZone("battleArea");

    // Pair Super Gundam with a synthetic AEUG-trait pilot (satisfies its
    // `(AEUG) Trait` link condition via the engine's trait-aware matcher).
    markAsLinkUnit(engine, attackerId);
    // Pair the enemy unit so the `paired:false` filter excludes it.
    // biome-ignore lint/suspicious/noExplicitAny: internal pair helper
    (engine.getG() as any).pilotAssignments[pairedEnemyId!] = "synthetic-enemy-pilot";

    engine.resolveCombat({ attackerId, target: unpairedEnemyId! });

    expect(findStatModifier(engine, unpairedEnemyId!, "ap")?.modifier).toBe(-2);
    expect(findStatModifier(engine, pairedEnemyId!, "ap")).toBeUndefined();
  });
});
