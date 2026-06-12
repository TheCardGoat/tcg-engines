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
import { gd01CagalliYulaAthha096 } from "./096-cagalli-yula-athha.ts";

describe("Cagalli Yula Athha (GD01-096)", () => {
  it("【Burst】 Add this card to your hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd01CagalliYulaAthha096] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");
    engine
      .getRuntime()
      .registerCardInstance(shieldId, gd01CagalliYulaAthha096.cardNumber, asPlayerId(PLAYER_TWO));

    engine.fireShieldBurst(shieldId);

    const zone = engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey;
    expect(zone).toBe(`hand:${PLAYER_TWO}`);
  });

  it("While this Unit is white, it gains <Blocker>", () => {
    // Unblocked by:
    //   (1) PR #122 — pilot cards are iterated by the constant-effect scan.
    //   (2) self* condition rebind — `selfIsColor` now reads the paired
    //       unit's color, not the pilot's own color, so "white unit" gates
    //       fire correctly from the pilot's text.
    const whiteUnit = createMockUnit({
      ap: 2,
      hp: 3,
      level: 4,
      cost: 1,
      color: "white",
    });
    const engine = GundamTestEngine.create(
      { hand: [whiteUnit, gd01CagalliYulaAthha096], resourceArea: activeResources(5) },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.deployUnit(whiteUnit));
    const [unitId] = p1.getCardsInZone("battleArea");
    expectSuccess(p1.assignPilot(gd01CagalliYulaAthha096, whiteUnit));

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(unitId!, engine.getG(), framework.cards, framework);
    expect(stats.keywords).toContain("Blocker");
  });

  it("does NOT gain <Blocker> when the paired unit is not white", () => {
    const blueUnit = createMockUnit({
      ap: 2,
      hp: 3,
      level: 4,
      cost: 1,
      color: "blue",
    });
    const engine = GundamTestEngine.create(
      { hand: [blueUnit, gd01CagalliYulaAthha096], resourceArea: activeResources(5) },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.deployUnit(blueUnit));
    const [unitId] = p1.getCardsInZone("battleArea");
    expectSuccess(p1.assignPilot(gd01CagalliYulaAthha096, blueUnit));

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(unitId!, engine.getG(), framework.cards, framework);
    expect(stats.keywords).not.toContain("Blocker");
  });
});
