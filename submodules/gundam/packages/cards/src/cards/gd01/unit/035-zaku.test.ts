import { describe, expect, it } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, activeResources, expectSuccess } from "@tcg/gundam-engine";
import { gd01Zaku035 } from "./035-zaku.ts";

describe("Zaku II (GD01-035)", () => {
  it("deploys from hand with its visible AP and HP", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01Zaku035],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd01Zaku035));

    expect(p1.getCardZone(gd01Zaku035)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getVisibleCard(gd01Zaku035)).toMatchObject({ effectiveAp: 2, effectiveHp: 2 });
  });
});
