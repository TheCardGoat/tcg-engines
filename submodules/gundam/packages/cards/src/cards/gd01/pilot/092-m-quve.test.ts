import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  asPlayerId,
  createMockUnit,
  expectSuccess,
  getEffectiveStats,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd01MQuve092 } from "./092-m-quve.ts";

describe("M'Quve (GD01-092)", () => {
  it("【Burst】 Add this card to your hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd01MQuve092] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");
    engine
      .getRuntime()
      .registerCardInstance(shieldId, gd01MQuve092.cardNumber, asPlayerId(PLAYER_TWO));

    engine.fireShieldBurst(shieldId);

    const zone = engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey;
    expect(zone).toBe(`hand:${PLAYER_TWO}`);
  });

  it("While this Unit is (Zeon), it gains <Breach 1>", () => {
    // Unblocked by:
    //   (1) PR #122 — pilot cards are iterated by the constant-effect scan.
    //   (2) self* condition rebind — `selfHasTrait` now reads the paired
    //       unit's traits rather than the pilot's, so the "(Zeon)" gate
    //       evaluates against the unit's printed traits.
    const zeonUnit = createMockUnit({
      ap: 2,
      hp: 3,
      level: 3,
      cost: 1,
      traits: ["zeon"],
    });
    const engine = GundamTestEngine.create(
      { hand: [zeonUnit, gd01MQuve092], resourceArea: activeResources(5) },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.deployUnit(zeonUnit));
    const [unitId] = p1.getCardsInZone("battleArea");
    expectSuccess(p1.assignPilot(gd01MQuve092, zeonUnit));

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(unitId!, engine.getG(), framework.cards, framework);
    expect(stats.keywords).toContain("Breach");
  });

  it("does NOT gain <Breach 1> when the paired unit is not (Zeon)", () => {
    const neutralUnit = createMockUnit({
      ap: 2,
      hp: 3,
      level: 3,
      cost: 1,
      traits: ["earth federation"],
    });
    const engine = GundamTestEngine.create(
      { hand: [neutralUnit, gd01MQuve092], resourceArea: activeResources(5) },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.deployUnit(neutralUnit));
    const [unitId] = p1.getCardsInZone("battleArea");
    expectSuccess(p1.assignPilot(gd01MQuve092, neutralUnit));

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(unitId!, engine.getG(), framework.cards, framework);
    expect(stats.keywords).not.toContain("Breach");
  });
});
