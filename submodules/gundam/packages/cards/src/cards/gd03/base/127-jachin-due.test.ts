import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  getEffectiveStats,
  seedBaseAsShield,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd03JachinDue127 } from "./127-jachin-due.ts";

describe("Jachin Due (GD03-127)", () => {
  it("【Burst】Deploy this card — flips into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd03JachinDue127] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, gd03JachinDue127);

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `baseSection:${PLAYER_TWO}`,
    );
  });

  it("【Deploy】 adds a shield to hand and gives a friendly ZAFT Unit AP+3 this turn", () => {
    const zaft = createMockUnit({ ap: 2, traits: ["zaft"] });
    const nonZaft = createMockUnit({ ap: 2, traits: ["earth alliance"] });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03JachinDue127],
        play: [zaft, nonZaft],
        resourceArea: activeResources(6),
        deck: 6,
      },
      {},
    );
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [zaftId, nonZaftId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.deployBase(gd03JachinDue127, { targets: [zaftId!] }));

    const framework = engine.getRuntime().getFrameworkReadAPI();
    expect(p1.getHand()).toContain(shieldIds[0]);
    expect(getEffectiveStats(zaftId!, engine.getG(), framework.cards, framework).ap).toBe(5);
    expect(getEffectiveStats(nonZaftId!, engine.getG(), framework.cards, framework).ap).toBe(2);
  });

  it("【Deploy】 rejects a non-ZAFT target for the AP bonus", () => {
    const nonZaft = createMockUnit({ traits: ["earth alliance"] });
    const engine = GundamTestEngine.create(
      { hand: [gd03JachinDue127], play: [nonZaft], resourceArea: activeResources(6), deck: 6 },
      {},
    );
    seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const nonZaftId = p1.getCardsInZone("battleArea")[0]!;

    expect(p1.deployBase(gd03JachinDue127, { targets: [nonZaftId] }).success).toBe(false);
  });
});
