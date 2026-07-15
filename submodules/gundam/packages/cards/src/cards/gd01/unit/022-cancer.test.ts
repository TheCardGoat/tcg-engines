import { describe, expect, it } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, activeResources, expectSuccess } from "@tcg/gundam-engine";
import { gd01Cancer022 } from "./022-cancer.ts";

describe("Cancer (GD01-022)", () => {
  it("deploys from hand with its visible AP and HP", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01Cancer022],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd01Cancer022));

    expect(p1.getCardZone(gd01Cancer022)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getVisibleCard(gd01Cancer022)).toMatchObject({ effectiveAp: 2, effectiveHp: 3 });
  });
});
