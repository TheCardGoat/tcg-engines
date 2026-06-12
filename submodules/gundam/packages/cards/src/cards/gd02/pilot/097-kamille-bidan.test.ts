import { describe, expect, it } from "vite-plus/test";
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
import type { PlayerId } from "@tcg/gundam-engine";
import { gd02KamilleBidan097 } from "./097-kamille-bidan.ts";

describe("Kamille Bidan (GD02-097)", () => {
  it("【Burst】 Add this card to your hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd02KamilleBidan097] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("constant AP+2 on the paired unit fires via the pilot-self rebind", () => {
    // Pilot-resident `type: "constant"` with `target: { owner: "self",
    // cardType: "unit" }`. PR #122: pilot-resident `owner: "self"`
    // rebinds onto the paired unit (rule 3-3-9-1). The printed
    // "while a friendly white Base is in play" precondition is NOT yet
    // encoded in card data — this test documents the rebind works and
    // the modifier lands on the paired unit.
    const baseAp = 2;
    const baseHp = 4;
    const pairedUnit = createMockUnit({
      ap: baseAp,
      hp: baseHp,
      level: 5,
      cost: 1,
      linkCondition: "[Kamille Bidan]",
    } as unknown as Parameters<typeof createMockUnit>[0]);

    const engine = GundamTestEngine.create(
      {
        hand: [pairedUnit, gd02KamilleBidan097],
        resourceArea: activeResources(6),
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.deployUnit(pairedUnit));
    expectSuccess(p1.assignPilot(gd02KamilleBidan097, pairedUnit));

    const runtime = engine.getRuntime();
    const framework = runtime.getFrameworkReadAPI();
    const unitId = runtime.getInstanceIdByDefinition(
      PLAYER_ONE as PlayerId,
      pairedUnit.cardNumber,
    )!;

    const stats = getEffectiveStats(unitId, engine.getG(), framework.cards, framework);
    // Pilot apBonus (1) + constant AP+2 = baseAp + 3.
    expect(stats.ap).toBe(baseAp + 1 + 2);
    expect(stats.hp).toBe(baseHp + 2); // pilot hpBonus (2)
  });
});
