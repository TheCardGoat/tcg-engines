import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  getDamageCounter,
  markAsLinkUnit,
} from "@tcg/gundam-engine";
import { gd03GundamKyrios022 } from "./022-gundam-kyrios.ts";

describe("Gundam Kyrios (GD03-022)", () => {
  it("【During Link】 deals 1 damage to all enemy Units (Lv.3 or lower) when this destroys an enemy by battle damage on your turn", () => {
    const fragileDefender = createMockUnit({ ap: 1, hp: 1, level: 2 });
    const lowLvEnemy = createMockUnit({ ap: 2, hp: 5, level: 3 });
    const highLvEnemy = createMockUnit({ ap: 2, hp: 5, level: 5 });

    const engine = GundamTestEngine.create(
      { play: [gd03GundamKyrios022] },
      { play: [{ card: fragileDefender, exhausted: true }, lowLvEnemy, highLvEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const [defenderId, lowLvId, highLvId] = p2.getCardsInZone("battleArea");

    // Mark Kyrios as a Link Unit (satisfies the duringLink gate).
    markAsLinkUnit(engine, attackerId);

    engine.resolveCombat({ attackerId, target: defenderId! });

    // Lv.3 enemy took 1 damage (filter Lv ≤ 3).
    expect(getDamageCounter(engine, lowLvId!)).toBe(1);
    // Lv.5 enemy is outside the filter — no damage.
    expect(getDamageCounter(engine, highLvId!)).toBe(0);
  });

  it("does NOT fire when this Unit is NOT a Link Unit (duringLink gate fails)", () => {
    const fragileDefender = createMockUnit({ ap: 1, hp: 1, level: 2 });
    const lowLvEnemy = createMockUnit({ ap: 2, hp: 5, level: 3 });

    const engine = GundamTestEngine.create(
      { play: [gd03GundamKyrios022] },
      { play: [{ card: fragileDefender, exhausted: true }, lowLvEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const [defenderId, lowLvId] = p2.getCardsInZone("battleArea");

    // Kyrios NOT marked as a Link Unit — duringLink gate fails.
    engine.resolveCombat({ attackerId, target: defenderId! });

    expect(getDamageCounter(engine, lowLvId!)).toBe(0);
  });
});
