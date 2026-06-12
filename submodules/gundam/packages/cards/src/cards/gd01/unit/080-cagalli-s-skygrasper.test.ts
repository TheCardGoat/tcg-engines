import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  asPlayerId,
  createMockUnit,
} from "@tcg/gundam-engine";
import { gd01CagalliSSkygrasper080 } from "./080-cagalli-s-skygrasper.ts";

describe("Cagalli's Skygrasper (GD01-080)", () => {
  it("【Destroyed】 returns a Lv.2-or-lower enemy Unit to its owner's hand", () => {
    // Cagalli (AP 2, HP 1) dies to an AP-2 attacker. A separate Lv.1
    // enemy is the only eligible target for the Destroyed trigger — the
    // big attacker (level 5 via createMockUnit default) is out of
    // range, so the auto-pick lands on the Lv.1 unit.
    const bigAttacker = createMockUnit({ ap: 2, hp: 5, level: 5 });
    const weakEnemy = createMockUnit({ ap: 1, hp: 5, level: 1 });
    const engine = GundamTestEngine.create(
      { play: [bigAttacker, weakEnemy] },
      { play: [gd01CagalliSSkygrasper080] },
    );
    const p1Id = asPlayerId(PLAYER_ONE);
    const p2Id = asPlayerId(PLAYER_TWO);
    const bigAttackerId = engine.getCardsInZone({ zone: "battleArea", playerId: p1Id })[0]!;
    const weakEnemyId = engine.getCardsInZone({ zone: "battleArea", playerId: p1Id })[1]!;
    const cagalliId = engine.getCardsInZone({ zone: "battleArea", playerId: p2Id })[0]!;

    engine.getG().exhausted[bigAttackerId] = false;

    engine.resolveCombat({ attackerId: bigAttackerId, target: cagalliId });

    // Cagalli destroyed (AP 2 vs HP 1).
    expect(engine.getState().ctx.zones.private.cardIndex[cagalliId]?.zoneKey).toBe(
      `trash:${PLAYER_TWO}`,
    );
    // Lv.1 enemy returned to p1's hand.
    expect(engine.getState().ctx.zones.private.cardIndex[weakEnemyId]?.zoneKey).toBe(
      `hand:${PLAYER_ONE}`,
    );
  });
});
