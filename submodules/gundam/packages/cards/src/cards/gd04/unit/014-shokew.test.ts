import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd04Shokew014 } from "./014-shokew.ts";

describe("Shokew (GD04-014)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd04Shokew014] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd04Shokew014.type).toBe("unit");
    expect(gd04Shokew014.level).toBe(2);
    expect(gd04Shokew014.cost).toBe(2);
    expect(gd04Shokew014.ap).toBe(2);
    expect(gd04Shokew014.hp).toBe(3);
  });
});
