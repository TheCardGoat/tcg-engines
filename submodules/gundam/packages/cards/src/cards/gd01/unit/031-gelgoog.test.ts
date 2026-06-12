import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd01Gelgoog031 } from "./031-gelgoog.ts";

describe("Gelgoog (GD01-031)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd01Gelgoog031] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd01Gelgoog031.type).toBe("unit");
    expect(gd01Gelgoog031.level).toBe(4);
    expect(gd01Gelgoog031.cost).toBe(2);
    expect(gd01Gelgoog031.ap).toBe(4);
    expect(gd01Gelgoog031.hp).toBe(3);
  });
});
