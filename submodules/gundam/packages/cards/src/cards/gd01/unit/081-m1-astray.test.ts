import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  createMockUnit,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd01M1Astray081 } from "./081-m1-astray.ts";

describe("M1 Astray (GD01-081)", () => {
  it("gets AP+1 and <Blocker> while another (Triple Ship Alliance) Unit is in play", () => {
    const ally = createMockUnit({ traits: ["triple ship alliance"] });
    const engine = GundamTestEngine.create({ play: [gd01M1Astray081, ally] }, {});
    const [astrayId] = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea");

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(astrayId!, engine.getG(), framework.cards, framework);
    expect(stats.ap).toBe(3); // printed 2 + 1
    expect(stats.keywords).toContain("Blocker");
  });

  it("stays at printed stats when no other (Triple Ship Alliance) Unit is present", () => {
    const unrelated = createMockUnit({ traits: ["zeon"] });
    const engine = GundamTestEngine.create({ play: [gd01M1Astray081, unrelated] }, {});
    const [astrayId] = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea");

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(astrayId!, engine.getG(), framework.cards, framework);
    expect(stats.ap).toBe(2);
    expect(stats.keywords ?? []).not.toContain("Blocker");
  });
});
