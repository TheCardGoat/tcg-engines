import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  expectSuccess,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd03BolinoakSammahn008 } from "./008-bolinoak-sammahn.ts";

describe("Bolinoak Sammahn (GD03-008)", () => {
  it("【During Pair】 gives this Unit Repair 2 while paired", () => {
    const pilot = createMockPilot();
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd03BolinoakSammahn008],
        resourceArea: activeResources(4),
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, unitId));

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(unitId, engine.getG(), framework.cards, framework);
    expect(stats.keywords).toContain("Repair");
  });
});
