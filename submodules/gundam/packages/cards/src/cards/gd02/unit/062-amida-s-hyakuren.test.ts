import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd02AmidaSHyakuren062 } from "./062-amida-s-hyakuren.ts";

describe("Amida's Hyakuren (GD02-062)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd02AmidaSHyakuren062] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd02AmidaSHyakuren062.type).toBe("unit");
    expect(gd02AmidaSHyakuren062.level).toBe(4);
    expect(gd02AmidaSHyakuren062.cost).toBe(2);
    expect(gd02AmidaSHyakuren062.ap).toBe(3);
    expect(gd02AmidaSHyakuren062.hp).toBe(4);
  });
});
