import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd01Loto011 } from "./011-loto.ts";

describe("Loto (GD01-011)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd01Loto011] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd01Loto011.type).toBe("unit");
    expect(gd01Loto011.level).toBe(2);
    expect(gd01Loto011.cost).toBe(2);
    expect(gd01Loto011.ap).toBe(2);
    expect(gd01Loto011.hp).toBe(2);
  });
});
