import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  expectSuccess,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd02BusterGundam076 } from "./076-buster-gundam.ts";

describe("Buster Gundam (GD02-076)", () => {
  it("does NOT have <Blocker> at printed AP 4", () => {
    const engine = GundamTestEngine.create({ play: [gd02BusterGundam076] }, {});
    const [busterId] = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea");

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(busterId!, engine.getG(), framework.cards, framework);
    expect(stats.ap).toBe(4);
    expect(stats.keywords ?? []).not.toContain("Blocker");
  });

  it("gains <Blocker> when AP reaches 5 via a pilot pairing", () => {
    // Pilot with apBonus 1 boosts Buster's 4 AP to 5 → selfStat condition fires.
    const pilot = createMockPilot({ apBonus: 1 });

    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd02BusterGundam076],
        resourceArea: activeResources(3),
        deck: 5,
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const busterId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, busterId));

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(busterId, engine.getG(), framework.cards, framework);
    expect(stats.ap).toBeGreaterThanOrEqual(5);
    expect(stats.keywords).toContain("Blocker");
  });
});
