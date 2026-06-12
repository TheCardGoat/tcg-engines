import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd01GuelSDilanza083 } from "./083-guel-s-dilanza.ts";

describe("Guel's Dilanza (GD01-083)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd01GuelSDilanza083] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd01GuelSDilanza083.type).toBe("unit");
    expect(gd01GuelSDilanza083.level).toBe(2);
    expect(gd01GuelSDilanza083.cost).toBe(2);
    expect(gd01GuelSDilanza083.ap).toBe(2);
    expect(gd01GuelSDilanza083.hp).toBe(2);
  });
});
