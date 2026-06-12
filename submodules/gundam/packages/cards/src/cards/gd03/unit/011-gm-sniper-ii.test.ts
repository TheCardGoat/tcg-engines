import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd03GmSniperIi011 } from "./011-gm-sniper-ii.ts";

describe("GM Sniper II (GD03-011)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd03GmSniperIi011] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd03GmSniperIi011.type).toBe("unit");
    expect(gd03GmSniperIi011.level).toBe(2);
    expect(gd03GmSniperIi011.cost).toBe(2);
    expect(gd03GmSniperIi011.ap).toBe(2);
    expect(gd03GmSniperIi011.hp).toBe(3);
  });
});
