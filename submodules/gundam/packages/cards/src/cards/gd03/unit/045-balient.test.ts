import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  expectSuccess,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd03Balient045 } from "./045-balient.ts";
import { gd03DaughtressFlyer044 } from "./044-daughtress-flyer.ts";

describe("Balient (GD03-045)", () => {
  it("gets AP+1 while you have a Unit token in play", () => {
    const engine = GundamTestEngine.create({
      hand: [gd03DaughtressFlyer044],
      play: [gd03Balient045],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const balientId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd03DaughtressFlyer044));

    const framework = engine.getRuntime().getFrameworkReadAPI();
    expect(getEffectiveStats(balientId, engine.getG(), framework.cards, framework).ap).toBe(3);
  });
});
