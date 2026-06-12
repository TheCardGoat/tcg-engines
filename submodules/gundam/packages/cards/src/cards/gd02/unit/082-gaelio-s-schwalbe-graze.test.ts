import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  createMockUnit,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd02GaelioSSchwalbeGraze082 } from "./082-gaelio-s-schwalbe-graze.ts";

describe("Gaelio's Schwalbe Graze (GD02-082)", () => {
  it("gains <Blocker> while another friendly (Gjallarhorn) Unit is in play", () => {
    const otherGjallarhorn = createMockUnit({ traits: ["gjallarhorn"] });
    const engine = GundamTestEngine.create(
      { play: [gd02GaelioSSchwalbeGraze082, otherGjallarhorn] },
      {},
    );
    const [gaelioId] = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea");

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(gaelioId!, engine.getG(), framework.cards, framework);
    expect(stats.keywords).toContain("Blocker");
  });

  it("does NOT gain <Blocker> without another friendly (Gjallarhorn) Unit", () => {
    const unrelated = createMockUnit({ traits: ["zeon"] });
    const engine = GundamTestEngine.create({ play: [gd02GaelioSSchwalbeGraze082, unrelated] }, {});
    const [gaelioId] = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea");

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(gaelioId!, engine.getG(), framework.cards, framework);
    expect(stats.keywords ?? []).not.toContain("Blocker");
  });
});
