import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  markAsLinkUnit,
  createMockUnit,
} from "@tcg/gundam-engine";
import { gd01SwordStrikeGundam073 } from "./073-sword-strike-gundam.ts";

describe("Sword Strike Gundam (GD01-073)", () => {
  // The `attack` trigger is gated by `duringLink`.
  it("【During Link】【Attack】 returns an enemy Unit with ≤2 HP to hand when attacking as a Link Unit", () => {
    const frail = createMockUnit({ ap: 1, hp: 2 });
    const sturdy = createMockUnit({ ap: 2, hp: 6 });
    const engine = GundamTestEngine.create(
      { play: [gd01SwordStrikeGundam073] },
      { play: [sturdy, frail] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const [sturdyId, frailId] = p2.getCardsInZone("battleArea");
    if (!sturdyId || !frailId) throw new Error("fixture failed");

    markAsLinkUnit(engine, attackerId);
    engine.getG().exhausted[attackerId] = false;

    const handBefore = engine.getCardCount({ zone: "hand", playerId: PLAYER_TWO });

    engine.resolveCombat({ attackerId, target: sturdyId });

    // Frail enemy bounced → in opponent's hand, not battleArea.
    const frailZone = engine.getState().ctx.zones.private.cardIndex[frailId]?.zoneKey;
    expect(frailZone).toBe(`hand:${PLAYER_TWO}`);
    expect(engine.getCardCount({ zone: "hand", playerId: PLAYER_TWO })).toBe(handBefore + 1);
  });
});
