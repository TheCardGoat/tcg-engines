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
import { gd01RiddheMarcenas089 } from "./089-riddhe-marcenas.ts";

describe("Riddhe Marcenas (GD01-089)", () => {
  it("【Burst】 Add this card to your hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd01RiddheMarcenas089] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("While this Unit has <Repair>, it gets AP+1 when Riddhe is paired onto it", () => {
    // Unblocked by:
    //   (1) PR #122 — pilot cards are iterated by the constant-effect scan
    //       (`getEffectiveStats` → derived-state), so a Constant effect
    //       printed on a paired pilot now contributes to the unit's stats.
    //   (2) `fix(engine): apply pilot identity rebind to self* conditions`
    //       — `selfHasKeyword` in the condition evaluator now resolves
    //       through `selfIdentityCardId` (paired unit) rather than the
    //       pilot's instance id, so the gate fires when the unit has Repair.
    const repairUnit = createMockUnit({
      ap: 2,
      hp: 3,
      level: 3,
      cost: 1,
      keywordEffects: [{ keyword: "Repair", value: 1 }],
    });
    const engine = GundamTestEngine.create(
      {
        hand: [repairUnit, gd01RiddheMarcenas089],
        resourceArea: activeResources(5),
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.deployUnit(repairUnit));
    const [unitId] = p1.getCardsInZone("battleArea");
    expectSuccess(p1.assignPilot(gd01RiddheMarcenas089, repairUnit));

    const framework = engine.getRuntime().getFrameworkReadAPI();

    // After pairing: base 2 + Riddhe apBonus 1 + Repair-gated +1 = 4.
    const afterStats = getEffectiveStats(unitId!, engine.getG(), framework.cards, framework);
    expect(afterStats.keywords).toContain("Repair");
    expect(afterStats.ap).toBe(4);
  });

  it("does NOT get the AP+1 when the paired unit has no <Repair>", () => {
    const plainUnit = createMockUnit({ ap: 2, hp: 3, level: 3, cost: 1 });
    const engine = GundamTestEngine.create(
      {
        hand: [plainUnit, gd01RiddheMarcenas089],
        resourceArea: activeResources(5),
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.deployUnit(plainUnit));
    const [unitId] = p1.getCardsInZone("battleArea");
    expectSuccess(p1.assignPilot(gd01RiddheMarcenas089, plainUnit));

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(unitId!, engine.getG(), framework.cards, framework);
    // Base 2 + pilot apBonus 1 only; no Repair → no self-condition buff.
    expect(stats.ap).toBe(3);
    expect(stats.keywords).not.toContain("Repair");
  });
});
