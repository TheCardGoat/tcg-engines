import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  activeResources,
  createMockPilot,
} from "@tcg/gundam-engine";
import { betaGundamMaForm002 } from "./002-gundam-ma-form.ts";

describe("Gundam (MA Form) (ST01-002)", () => {
  it("【When Paired·(White Base Team) Pilot】 fires Draw 1 with a matching pilot", () => {
    const wbtPilot = createMockPilot({ traits: ["white base team"] });
    const engine = GundamTestEngine.create({
      play: [betaGundamMaForm002],
      hand: [wbtPilot],
      resourceArea: activeResources(2),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const deckBefore = p1.getCardsInZone("deck").length;
    const handBefore = p1.getHand().length;

    expectSuccess(p1.assignPilot(wbtPilot, betaGundamMaForm002));

    // Drew 1 card (deck -1); hand: -1 pilot played, +1 drawn = net 0.
    expect(p1.getCardsInZone("deck").length).toBe(deckBefore - 1);
    expect(p1.getHand().length).toBe(handBefore);
  });

  it("does NOT draw when paired with a pilot lacking the (White Base Team) trait", () => {
    // The `qualification` filter on the WhenPaired activation restricts
    // the draw to (White Base Team) pilots. Rules 3-2-5 / 10-2-1.
    const zeonPilot = createMockPilot({ traits: ["zeon"] });
    const engine = GundamTestEngine.create({
      play: [betaGundamMaForm002],
      hand: [zeonPilot],
      resourceArea: activeResources(2),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const deckBefore = p1.getCardsInZone("deck").length;
    const handBefore = p1.getHand().length;

    expectSuccess(p1.assignPilot(zeonPilot, betaGundamMaForm002));

    // No draw — deck unchanged; hand: -1 (pilot played), +0 drawn.
    expect(p1.getCardsInZone("deck").length).toBe(deckBefore);
    expect(p1.getHand().length).toBe(handBefore - 1);
  });
});
