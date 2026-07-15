import { describe, expect, it } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, activeResources, expectSuccess } from "@tcg/gundam-engine";
import { gd01Pisces021 } from "./021-pisces.ts";

describe("Pisces (GD01-021)", () => {
  it("deploys from hand with its visible AP and HP", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01Pisces021],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd01Pisces021));

    expect(p1.getCardZone(gd01Pisces021)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getVisibleCard(gd01Pisces021)).toMatchObject({ effectiveAp: 1, effectiveHp: 2 });
  });
});
