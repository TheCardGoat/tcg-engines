import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd01Dinn064 } from "./064-dinn.ts";

describe("DINN (GD01-064)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd01Dinn064] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd01Dinn064.type).toBe("unit");
    expect(gd01Dinn064.level).toBe(2);
    expect(gd01Dinn064.cost).toBe(2);
    expect(gd01Dinn064.ap).toBe(3);
    expect(gd01Dinn064.hp).toBe(2);
  });
});
