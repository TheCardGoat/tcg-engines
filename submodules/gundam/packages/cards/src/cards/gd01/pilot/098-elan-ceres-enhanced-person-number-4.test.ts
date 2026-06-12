import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  asPlayerId,
  seedShieldsFromDeck,
  createMockUnit,
  expectSuccess,
  getDamageCounter,
  activeResources,
} from "@tcg/gundam-engine";
import { gd01ElanCeresEnhancedPersonNumber4098 } from "./098-elan-ceres-enhanced-person-number-4.ts";

describe("Elan Ceres (Enhanced Person Number 4) (GD01-098)", () => {
  it("【Burst】 Add this card to your hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd01ElanCeresEnhancedPersonNumber4098] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");
    engine
      .getRuntime()
      .registerCardInstance(
        shieldId,
        gd01ElanCeresEnhancedPersonNumber4098.cardNumber,
        asPlayerId(PLAYER_TWO),
      );

    engine.fireShieldBurst(shieldId);

    const zone = engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey;
    expect(zone).toBe(`hand:${PLAYER_TWO}`);
  });

  it("【Activate·Action】【Once per Turn】this Unit recovers 1 HP when an enemy unit is in play", () => {
    // Place Elan Ceres as a pilot on a friendly unit. The unit starts damaged.
    // An enemy unit with low AP is on the board to satisfy the condition gate.
    const friendlyUnit = createMockUnit({ ap: 3, hp: 5, level: 4, cost: 1 });
    const enemyUnit = createMockUnit({ ap: 1, hp: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01ElanCeresEnhancedPersonNumber4098],
        play: [friendlyUnit],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { play: [enemyUnit] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    // Assign pilot to unit
    expectSuccess(p1.assignPilot(gd01ElanCeresEnhancedPersonNumber4098, friendlyUnit));

    // Damage the paired unit so recovery is observable
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    engine.getG().damage[unitId] = 2;
    expect(getDamageCounter(engine, unitId)).toBe(2);

    // Set phase for action activation
    engine.setPhase("end-phase");
    engine.setStep("action-step");

    // Activate the pilot's ability (effect index 0 = the only activated effect
    // in getActivatedEffects, which filters out the burst/triggered effect)
    expectSuccess(p1.activateAbility(gd01ElanCeresEnhancedPersonNumber4098, 0, {}));

    // The paired unit should have recovered 1 HP (damage reduced by 1)
    expect(getDamageCounter(engine, unitId)).toBe(1);
  });
});
