import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  getEffectiveStats,
  seedShieldsFromDeck,
  asPlayerId,
} from "@tcg/gundam-engine";
import { gd01DuoMaxwell090 } from "./090-duo-maxwell.ts";

describe("Duo Maxwell (GD01-090)", () => {
  it("【Burst】Add this card to your hand.", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd01DuoMaxwell090] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");
    engine
      .getRuntime()
      .registerCardInstance(shieldId, gd01DuoMaxwell090.cardNumber, asPlayerId(PLAYER_TWO));

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("【During Link】This Unit's AP can't be reduced by enemy effects.", () => {
    // Create a unit with a link condition that matches Duo Maxwell.
    const linkUnit = createMockUnit({
      ap: 5,
      hp: 5,
      level: 4,
      linkCondition: "[Duo Maxwell]",
    });

    const engine = GundamTestEngine.create(
      {
        hand: [gd01DuoMaxwell090],
        play: [linkUnit],
        resourceArea: activeResources(5),
        deck: 5,
      },
      { play: [createMockUnit({ ap: 3, hp: 5 })], deck: 5, resourceArea: activeResources(3) },
    );

    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    // Pair Duo Maxwell to the unit, forming a Link Unit.
    expectSuccess(p1.assignPilot(gd01DuoMaxwell090, unitId));

    // Verify link is formed: base AP = 5, pilot bonus = 1 → AP = 6
    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(unitId, engine.getG(), framework.cards, framework);
    expect(stats.ap).toBe(6);

    // The restrict should be active.
    expect(stats.restrictions).toContain("prevent-stat-reduction-ap-enemy");

    // Now apply an enemy AP reduction via a continuous effect.
    engine.getG().continuousEffects.push({
      id: "enemy-ap-debuff",
      sourceId: engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!,
      targetId: unitId,
      payload: { kind: "stat-modifier", stat: "ap", modifier: -2 },
      duration: "this-turn",
      createdAtTurn: 1,
    });

    // The enemy AP reduction should be blocked: AP stays at 6.
    const statsAfterDebuff = getEffectiveStats(unitId, engine.getG(), framework.cards, framework);
    expect(statsAfterDebuff.ap).toBe(6);

    // But a friendly AP reduction should still apply.
    engine.getG().continuousEffects.push({
      id: "friendly-ap-debuff",
      sourceId: unitId, // self-sourced
      targetId: unitId,
      payload: { kind: "stat-modifier", stat: "ap", modifier: -1 },
      duration: "this-turn",
      createdAtTurn: 1,
    });

    const statsAfterFriendlyDebuff = getEffectiveStats(
      unitId,
      engine.getG(),
      framework.cards,
      framework,
    );
    expect(statsAfterFriendlyDebuff.ap).toBe(5);
  });
});
