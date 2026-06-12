import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  markAsLinkUnit,
  createMockUnit,
} from "@tcg/gundam-engine";
import { gd02Tallgeese005 } from "./005-tallgeese.ts";

describe("Tallgeese (GD02-005)", () => {
  // The `attack` trigger is gated by `duringLink`.
  it("【During Link】【Attack】 rests an enemy Unit with ≤2 HP when attacking as a Link Unit", () => {
    // Two enemy units: a sturdy combat target + a frail 2-HP secondary
    // that the attack-trigger can rest without interference.
    const frail = createMockUnit({ ap: 1, hp: 2 });
    const sturdy = createMockUnit({ ap: 2, hp: 6 });
    const engine = GundamTestEngine.create({ play: [gd02Tallgeese005] }, { play: [sturdy, frail] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const [sturdyId, frailId] = p2.getCardsInZone("battleArea");
    if (!sturdyId || !frailId) throw new Error("fixture failed");

    markAsLinkUnit(engine, attackerId);
    engine.getG().exhausted[attackerId] = false;
    engine.getG().exhausted[frailId] = false;

    expect(engine.getG().exhausted[frailId]).toBe(false);

    engine.resolveCombat({ attackerId, target: sturdyId });

    // Attack trigger rested the 2-HP enemy.
    expect(engine.getG().exhausted[frailId]).toBe(true);
  });
});
