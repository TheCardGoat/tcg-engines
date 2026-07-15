import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, activeResources, expectSuccess } from "@tcg/gundam-engine";
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

    expect(p1.getVisibleCard(balientId)?.effectiveAp).toBe(3);
  });

  it("keeps its printed AP while no friendly Unit token is in play", () => {
    const engine = GundamTestEngine.create({ play: [gd03Balient045] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const balientId = p1.getCardsInZone("battleArea")[0]!;

    expect(p1.getVisibleCard(balientId)?.effectiveAp).toBe(2);
  });
});
