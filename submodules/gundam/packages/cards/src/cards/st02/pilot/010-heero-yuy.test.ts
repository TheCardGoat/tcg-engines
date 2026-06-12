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
import type { PlayerId } from "@tcg/gundam-engine";
import { st02HeeroYuy010 } from "./010-heero-yuy.ts";

describe("Heero Yuy (ST02-010)", () => {
  it("【Burst】 Add this card to your hand — moves shield into hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [st02HeeroYuy010] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("【During Link】 grants AP+1 and HP+1 while the unit is linked", () => {
    // Pilot-resident constant effect with a `duringLink` condition
    // applies AP+1 / HP+1 to the paired unit (rule 3-3-9-1 — "this Unit"
    // on a pilot card is the paired unit). The derived-state continuous
    // scan now iterates pilot cards in battleArea, and `owner: "self"`
    // rebinds onto the paired unit's identity so the modifier lands.
    const baseAp = 2;
    const baseHp = 4;
    const unit = createMockUnit({
      ap: baseAp,
      hp: baseHp,
      level: 4,
      cost: 1,
      linkCondition: "[Heero Yuy]",
    } as unknown as Parameters<typeof createMockUnit>[0]);

    const engine = GundamTestEngine.create(
      { hand: [unit, st02HeeroYuy010], resourceArea: activeResources(5) },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.deployUnit(unit));
    expectSuccess(p1.assignPilot(st02HeeroYuy010, unit));

    const runtime = engine.getRuntime();
    const framework = runtime.getFrameworkReadAPI();
    const unitId = runtime.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, unit.cardNumber)!;

    const stats = getEffectiveStats(unitId, engine.getG(), framework.cards, framework);
    // Pilot's apBonus (2) + duringLink AP+1 → +3 above base.
    // Pilot's hpBonus (1) + duringLink HP+1 → +2 above base.
    expect(stats.ap).toBe(baseAp + 2 + 1);
    expect(stats.hp).toBe(baseHp + 1 + 1);
  });

  it("【During Link】 does NOT apply when the pairing isn't a link", () => {
    // Same pilot paired onto a unit whose linkCondition the pilot does not
    // satisfy (or that has no linkCondition at all) → not a link unit, so
    // the duringLink gate must keep the modifier off.
    const baseAp = 2;
    const baseHp = 4;
    const unit = createMockUnit({ ap: baseAp, hp: baseHp, level: 4, cost: 1 });

    const engine = GundamTestEngine.create(
      { hand: [unit, st02HeeroYuy010], resourceArea: activeResources(5) },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.deployUnit(unit));
    expectSuccess(p1.assignPilot(st02HeeroYuy010, unit));

    const runtime = engine.getRuntime();
    const framework = runtime.getFrameworkReadAPI();
    const unitId = runtime.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, unit.cardNumber)!;

    const stats = getEffectiveStats(unitId, engine.getG(), framework.cards, framework);
    // Just the pilot apBonus / hpBonus, no duringLink delta.
    expect(stats.ap).toBe(baseAp + 2);
    expect(stats.hp).toBe(baseHp + 1);
  });
});
