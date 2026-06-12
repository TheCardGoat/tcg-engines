import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  asPlayerId,
  createMockUnit,
} from "@tcg/gundam-engine";
import { gd01GearaDogaSleeves056 } from "./056-geara-doga-sleeves.ts";

describe("Geara Doga (Sleeves) (GD01-056)", () => {
  it("【Destroyed】Choose 1 enemy Unit with 5 or less AP. Deal 1 damage to it.", () => {
    // Geara Doga Sleeves (AP 2, HP 3) dies to an AP-3 attacker. The
    // Destroyed trigger auto-picks the only eligible enemy (≤ 5 AP
    // filter over p1's battleArea) — we set up a sole attacker so the
    // auto-pick is deterministic.
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [gd01GearaDogaSleeves056] },
    );
    const p1Id = asPlayerId(PLAYER_ONE);
    const p2Id = asPlayerId(PLAYER_TWO);
    const attackerId = engine.getCardsInZone({ zone: "battleArea", playerId: p1Id })[0]!;
    const gearaDogaId = engine.getCardsInZone({ zone: "battleArea", playerId: p2Id })[0]!;

    engine.getG().exhausted[attackerId] = false;

    engine.resolveCombat({ attackerId, target: gearaDogaId });

    // Geara Doga destroyed (AP 3 vs HP 3).
    expect(engine.getState().ctx.zones.private.cardIndex[gearaDogaId]?.zoneKey).toBe(
      `trash:${PLAYER_TWO}`,
    );
    // Counter-attack from Geara (AP 2) deals 2; Destroyed trigger deals
    // an additional 1 damage to the sole enemy attacker → 3 total.
    expect(engine.getG().damage[attackerId]).toBe(3);
  });
});
