import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  expectSuccess,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd01GundamHeavyarms034 } from "./034-gundam-heavyarms.ts";

describe("Gundam Heavyarms (GD01-034)", () => {
  it("【During Pair】This Unit gains <Breach 3>.", () => {
    const pilot = createMockPilot();

    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd01GundamHeavyarms034],
        resourceArea: activeResources(3),
        deck: 5,
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const statsBefore = getEffectiveStats(unitId, engine.getG(), framework.cards, framework);
    expect(statsBefore.keywords).not.toContain("Breach");

    expectSuccess(p1.assignPilot(pilot, unitId));

    const statsAfter = getEffectiveStats(unitId, engine.getG(), framework.cards, framework);
    expect(statsAfter.keywords).toContain("Breach");
  });
});
