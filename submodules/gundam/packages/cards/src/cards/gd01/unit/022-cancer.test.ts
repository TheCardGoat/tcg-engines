import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd01Cancer022 } from "./022-cancer.ts";

describe("Cancer (GD01-022)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd01Cancer022] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd01Cancer022.type).toBe("unit");
    expect(gd01Cancer022.level).toBe(2);
    expect(gd01Cancer022.cost).toBe(2);
    expect(gd01Cancer022.ap).toBe(2);
    expect(gd01Cancer022.hp).toBe(3);
  });
});
