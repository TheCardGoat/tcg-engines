import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd01Gogg037 } from "./037-gogg.ts";

describe("Gogg (GD01-037)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd01Gogg037] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd01Gogg037.type).toBe("unit");
    expect(gd01Gogg037.level).toBe(2);
    expect(gd01Gogg037.cost).toBe(2);
    expect(gd01Gogg037.ap).toBe(2);
    expect(gd01Gogg037.hp).toBe(3);
  });
});
