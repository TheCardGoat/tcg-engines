import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd01Goohn062 } from "./062-goohn.ts";

describe("GOOhN (GD01-062)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd01Goohn062] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd01Goohn062.type).toBe("unit");
    expect(gd01Goohn062.level).toBe(1);
    expect(gd01Goohn062.cost).toBe(1);
    expect(gd01Goohn062.ap).toBe(1);
    expect(gd01Goohn062.hp).toBe(2);
  });
});
