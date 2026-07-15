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
import { gd02ChalliaBullGq090 } from "./090-challia-bull-gq.ts";

describe("Challia Bull (GQ) (GD02-090)", () => {
  it("【Burst】 Add this card to your hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd02ChalliaBullGq090] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("constant AP+1 on the paired unit fires via the pilot-self rebind", () => {
    // Pilot-resident `type: "constant"` with `target: { owner: "self",
    // cardType: "unit" }`. PR #122: pilot-resident "self" rebinds onto
    // the paired unit (rule 3-3-9-1). The printed "while another Unit
    // with <High-Maneuver> is in play" precondition is NOT encoded in
    // card data — effect fires unconditionally once paired; this test
    // documents the rebind.
    const baseAp = 2;
    const baseHp = 4;
    const pairedUnit = createMockUnit({
      ap: baseAp,
      hp: baseHp,
      level: 5,
      cost: 1,
      linkCondition: "[Challia Bull]",
    } as unknown as Parameters<typeof createMockUnit>[0]);

    const engine = GundamTestEngine.create(
      {
        hand: [pairedUnit, gd02ChalliaBullGq090],
        resourceArea: activeResources(6),
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.deployUnit(pairedUnit));
    expectSuccess(p1.assignPilot(gd02ChalliaBullGq090, pairedUnit));

    const runtime = engine.getRuntime();
    const framework = runtime.getFrameworkReadAPI();
    const unitId = runtime.getInstanceIdByDefinition(
      PLAYER_ONE as PlayerId,
      pairedUnit.cardNumber,
    )!;

    const stats = getEffectiveStats(unitId, engine.getG(), framework.cards, framework);
    expect(stats.ap).toBe(baseAp + 1 + 1); // pilot apBonus + constant AP+1
    expect(stats.hp).toBe(baseHp + 2); // pilot hpBonus
  });
});
