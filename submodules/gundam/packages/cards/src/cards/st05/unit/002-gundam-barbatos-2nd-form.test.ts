import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, getEffectiveStats } from "@tcg/gundam-engine";
import { st05GundamBarbatos2ndForm002 } from "./002-gundam-barbatos-2nd-form.ts";

describe("Gundam Barbatos 2nd Form (ST05-002)", () => {
  it("gets AP+2 while this Unit is damaged", () => {
    const engine = GundamTestEngine.create({ play: [st05GundamBarbatos2ndForm002] }, {});
    const [unitId] = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea");
    const framework = engine.getRuntime().getFrameworkReadAPI();

    // Printed stats → no damage, no AP+2.
    const statsBefore = getEffectiveStats(unitId!, engine.getG(), framework.cards, framework);
    expect(statsBefore.ap).toBe(2);

    // Seed 1 damage → `selfIsDamaged` condition fires, constant AP+2 applies.
    engine.getG().damage[unitId!] = 1;
    const statsAfter = getEffectiveStats(unitId!, engine.getG(), framework.cards, framework);
    expect(statsAfter.ap).toBe(4);
  });
});
