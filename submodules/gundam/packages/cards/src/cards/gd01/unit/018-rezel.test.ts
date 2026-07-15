import { describe, expect, it } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, activeResources, expectSuccess } from "@tcg/gundam-engine";
import { gd01Rezel018 } from "./018-rezel.ts";

describe("ReZEL (GD01-018)", () => {
  it("deploys from hand with its visible AP and HP", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01Rezel018],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd01Rezel018));

    expect(p1.getCardZone(gd01Rezel018)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getVisibleCard(gd01Rezel018)).toMatchObject({ effectiveAp: 4, effectiveHp: 3 });
  });
});
