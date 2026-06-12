import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd03Cgue046 } from "./046-cgue.ts";

describe("CGUE (GD03-046)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd03Cgue046] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd03Cgue046.type).toBe("unit");
    expect(gd03Cgue046.level).toBe(2);
    expect(gd03Cgue046.cost).toBe(2);
    expect(gd03Cgue046.ap).toBe(2);
    expect(gd03Cgue046.hp).toBe(3);
  });
});
