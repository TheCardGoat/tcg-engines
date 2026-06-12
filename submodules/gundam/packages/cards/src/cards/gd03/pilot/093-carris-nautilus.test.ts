import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockUnit,
  expectSuccess,
  getEffectiveStats,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd03CarrisNautilus093 } from "./093-carris-nautilus.ts";

describe("Carris Nautilus (GD03-093)", () => {
  it("【Burst】 adds this card to hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd03CarrisNautilus093] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("while no enemy Base is in play, the paired Unit gets AP+1", () => {
    const host = createMockUnit({ ap: 2, hp: 4, linkCondition: "[Carris Nautilus]" });
    const engine = GundamTestEngine.create({
      hand: [host, gd03CarrisNautilus093],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(host));
    expectSuccess(p1.assignPilot(gd03CarrisNautilus093, host));
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(hostId, engine.getG(), framework.cards, framework);
    expect(stats.ap).toBe(2 + gd03CarrisNautilus093.apBonus + 1);
    expect(stats.hp).toBe(4 + gd03CarrisNautilus093.hpBonus);
  });

  it("does not grant AP+1 while an enemy Base is in play", () => {
    const host = createMockUnit({ ap: 2, hp: 4, linkCondition: "[Carris Nautilus]" });
    const enemyBase = createMockBase({ hp: 5 });
    const engine = GundamTestEngine.create(
      { hand: [host, gd03CarrisNautilus093], resourceArea: activeResources(4) },
      { baseSection: [enemyBase] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(host));
    expectSuccess(p1.assignPilot(gd03CarrisNautilus093, host));
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(hostId, engine.getG(), framework.cards, framework);
    expect(stats.ap).toBe(2 + gd03CarrisNautilus093.apBonus);
    expect(stats.hp).toBe(4 + gd03CarrisNautilus093.hpBonus);
  });
});
