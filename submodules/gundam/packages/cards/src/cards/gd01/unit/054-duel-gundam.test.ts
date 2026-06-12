import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  createMockPilot,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd01DuelGundam054 } from "./054-duel-gundam.ts";

describe("Duel Gundam (GD01-054)", () => {
  it("While this Unit has 5 or more AP, it gains <Breach 3>", () => {
    // Base AP 3 + pilot apBonus 2 = 5 → condition satisfied.
    const pilot = createMockPilot({ apBonus: 2, hpBonus: 0 });
    const engine = GundamTestEngine.create({ play: [gd01DuelGundam054, pilot] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [duelId, pilotId] = p1.getCardsInZone("battleArea");

    engine.getG().pilotAssignments[duelId!] = pilotId!;

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(duelId!, engine.getG(), framework.cards, framework);
    expect(stats.ap).toBe(5);
    expect(stats.keywords).toContain("Breach");
  });

  it("Below 5 AP, Duel Gundam does not gain <Breach 3>", () => {
    const engine = GundamTestEngine.create({ play: [gd01DuelGundam054] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [duelId] = p1.getCardsInZone("battleArea");

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(duelId!, engine.getG(), framework.cards, framework);
    expect(stats.ap).toBe(3);
    expect(stats.keywords ?? []).not.toContain("Breach");
  });
});
