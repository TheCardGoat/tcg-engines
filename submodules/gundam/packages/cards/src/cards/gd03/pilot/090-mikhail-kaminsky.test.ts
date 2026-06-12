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
import { gd03MikhailKaminsky090 } from "./090-mikhail-kaminsky.ts";

describe("Mikhail Kaminsky (GD03-090)", () => {
  it("【Burst】 adds this card to hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd03MikhailKaminsky090] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("【Attack】 grants Breach 1 to a friendly Cyclops Team Unit", () => {
    const host = createMockUnit({ traits: ["cyclops team"], linkCondition: "[Mikhail Kaminsky]" });
    const defender = { card: createMockUnit({ hp: 5 }), exhausted: true };
    const engine = GundamTestEngine.create(
      { hand: [host, gd03MikhailKaminsky090], resourceArea: activeResources(4) },
      { play: [defender] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const defenderId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(host));
    expectSuccess(p1.assignPilot(gd03MikhailKaminsky090, host));
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.enterBattle(hostId, defenderId));

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(hostId, engine.getG(), framework.cards, framework);
    expect(stats.keywords).toContain("Breach");
  });
});
