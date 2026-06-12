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
} from "@tcg/gundam-engine";
import { gd03AsemuAsuno088 } from "./088-asemu-asuno.ts";

describe("Asemu Asuno (GD03-088)", () => {
  it("【Burst】 adds this card to hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd03AsemuAsuno088] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("【During Link】 gives the linked (AGE System) Unit AP+1 and <Breach 1>", () => {
    const host = createMockUnit({
      ap: 2,
      hp: 4,
      traits: ["age system"],
      linkCondition: "[Asemu Asuno]",
    });
    const engine = GundamTestEngine.create({
      hand: [host, gd03AsemuAsuno088],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(host));
    expectSuccess(p1.assignPilot(gd03AsemuAsuno088, host));
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(hostId, engine.getG(), framework.cards, framework);
    expect(stats.ap).toBe(2 + gd03AsemuAsuno088.apBonus + 1);
    expect(stats.hp).toBe(4 + gd03AsemuAsuno088.hpBonus);
    expect(stats.keywords).toContain("Breach");
  });

  it("does not grant the during-link bonus to a linked non-(AGE System) Unit", () => {
    const host = createMockUnit({
      ap: 2,
      hp: 4,
      traits: ["earth federation"],
      linkCondition: "[Asemu Asuno]",
    });
    const engine = GundamTestEngine.create({
      hand: [host, gd03AsemuAsuno088],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(host));
    expectSuccess(p1.assignPilot(gd03AsemuAsuno088, host));
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(hostId, engine.getG(), framework.cards, framework);
    expect(stats.ap).toBe(2 + gd03AsemuAsuno088.apBonus);
    expect(stats.hp).toBe(4 + gd03AsemuAsuno088.hpBonus);
    expect(stats.keywords).not.toContain("Breach");
  });
});
