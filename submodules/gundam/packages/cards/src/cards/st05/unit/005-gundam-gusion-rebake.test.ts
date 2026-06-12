import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  asPlayerId,
  createMockUnit,
} from "@tcg/gundam-engine";
import { st05GundamGusionRebake005 } from "./005-gundam-gusion-rebake.ts";

describe("Gundam Gusion Rebake (ST05-005)", () => {
  it("【Destroyed】 rests an enemy Unit with 4 or less AP when killed in combat", () => {
    // Gusion Rebake has HP 4 AP 3. An AP-4 big attacker destroys it
    // (and is too strong for the ≤ 4 AP rest-filter). A separate AP-2
    // active unit is the only eligible target; the Destroyed trigger
    // auto-picks and rests it.
    const bigAttacker = createMockUnit({ ap: 5, hp: 5 });
    const weakEnemy = createMockUnit({ ap: 2, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [bigAttacker, weakEnemy] },
      { play: [st05GundamGusionRebake005] },
    );
    const p1Id = asPlayerId(PLAYER_ONE);
    const p2Id = asPlayerId(PLAYER_TWO);
    const bigAttackerId = engine.getCardsInZone({ zone: "battleArea", playerId: p1Id })[0]!;
    const weakEnemyId = engine.getCardsInZone({ zone: "battleArea", playerId: p1Id })[1]!;
    const gusionId = engine.getCardsInZone({ zone: "battleArea", playerId: p2Id })[0]!;

    engine.getG().exhausted[bigAttackerId] = false;
    engine.getG().exhausted[weakEnemyId] = false;

    engine.resolveCombat({ attackerId: bigAttackerId, target: gusionId });

    // Gusion destroyed (AP 5 vs HP 4).
    expect(engine.getState().ctx.zones.private.cardIndex[gusionId]?.zoneKey).toBe(
      `trash:${PLAYER_TWO}`,
    );
    // Destroyed trigger auto-picks the only ≤ 4 AP enemy (the weak
    // unit) and rests it — the big attacker is out of range.
    expect(engine.getG().exhausted[weakEnemyId]).toBe(true);
  });
});
