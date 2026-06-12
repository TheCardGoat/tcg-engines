import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  createMockUnit,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { betaM1Astray081 } from "./081-m1-astray.ts";

describe("M1 Astray (GD01-081)", () => {
  it("While another (Triple Ship Alliance) Unit is in play, M1 Astray gains AP+1 and <Blocker>", () => {
    const ally = createMockUnit({ traits: ["triple ship alliance"], ap: 2, hp: 2 });
    const engine = GundamTestEngine.create({ play: [betaM1Astray081, ally] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [astrayId] = p1.getCardsInZone("battleArea");

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(astrayId!, engine.getG(), framework.cards, framework);
    // Base AP 2 + constant +1 = 3
    expect(stats.ap).toBe(3);
    expect(stats.keywords).toContain("Blocker");
  });

  it("Without another (Triple Ship Alliance) Unit, the constant stays gated", () => {
    const engine = GundamTestEngine.create({ play: [betaM1Astray081] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [astrayId] = p1.getCardsInZone("battleArea");

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(astrayId!, engine.getG(), framework.cards, framework);
    expect(stats.ap).toBe(2);
    expect(stats.keywords ?? []).not.toContain("Blocker");
  });
});
