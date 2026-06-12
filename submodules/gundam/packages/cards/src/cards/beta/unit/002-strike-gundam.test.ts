import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, expectSuccess, activeResources } from "@tcg/gundam-engine";
import { betaStrikeGundam002 } from "./002-strike-gundam.ts";

describe("Strike Gundam (ST04-002)", () => {
  it("【Deploy】Draw 1. Then, discard 1.", () => {
    const engine = GundamTestEngine.create({
      hand: [betaStrikeGundam002],
      resourceArea: activeResources(4),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const deckBefore = p1.getCardsInZone("deck").length;
    const trashBefore = p1.getCardsInZone("trash").length;
    const handBefore = p1.getHand().length;

    expectSuccess(p1.deployUnit(betaStrikeGundam002));

    // Unit went to battleArea, deck lost 1 (drawn), one card landed in trash (discarded).
    expect(p1.getCardsInZone("battleArea").length).toBe(1);
    expect(p1.getCardsInZone("deck").length).toBe(deckBefore - 1);
    expect(p1.getCardsInZone("trash").length).toBe(trashBefore + 1);
    // Net hand size: -1 Strike (played), +1 drawn, -1 discarded = -1.
    expect(p1.getHand().length).toBe(handBefore - 1);
  });
});
