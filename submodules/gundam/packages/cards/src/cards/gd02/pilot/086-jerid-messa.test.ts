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
import { gd02JeridMessa086 } from "./086-jerid-messa.ts";

describe("Jerid Messa (GD02-086)", () => {
  it("【Burst】 Add this card to your hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd02JeridMessa086] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("While you have another (Titans) Unit in play, this gets AP+1", () => {
    // Pilot-resident `type: "constant"` with `target: { owner: "self" }`.
    // Rule 3-3-9-1: "this Unit" on a pilot card refers to the paired unit;
    // PR #122 rebinds `owner: "self"` onto that paired unit's identity so
    // the statModifier lands on the unit the pilot is attached to.
    const baseAp = 2;
    const baseHp = 4;
    const pairedUnit = createMockUnit({
      ap: baseAp,
      hp: baseHp,
      level: 3,
      cost: 1,
      linkCondition: "[Jerid Messa]",
    } as unknown as Parameters<typeof createMockUnit>[0]);
    const otherTitansUnit = createMockUnit({
      ap: 1,
      hp: 1,
      level: 1,
      cost: 1,
      traits: ["titans"],
    } as unknown as Parameters<typeof createMockUnit>[0]);

    const engine = GundamTestEngine.create(
      {
        hand: [pairedUnit, gd02JeridMessa086],
        play: [otherTitansUnit],
        resourceArea: activeResources(5),
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.deployUnit(pairedUnit));
    expectSuccess(p1.assignPilot(gd02JeridMessa086, pairedUnit));

    const runtime = engine.getRuntime();
    const framework = runtime.getFrameworkReadAPI();
    const unitId = runtime.getInstanceIdByDefinition(
      PLAYER_ONE as PlayerId,
      pairedUnit.cardNumber,
    )!;

    const stats = getEffectiveStats(unitId, engine.getG(), framework.cards, framework);
    // Pilot apBonus (1) + constant statModifier AP+1 (gated on another
    // (Titans) unit in play) = baseAp + 2.
    expect(stats.ap).toBe(baseAp + 1 + 1);
    expect(stats.hp).toBe(baseHp + 1); // pilot hpBonus (1)
  });
});
