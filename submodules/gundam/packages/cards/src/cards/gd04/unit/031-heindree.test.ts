import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd04Heindree031 } from "./031-heindree.ts";

describe("Heindree (GD04-031)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd04Heindree031] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd04Heindree031.type).toBe("unit");
    expect(gd04Heindree031.level).toBe(2);
    expect(gd04Heindree031.cost).toBe(2);
    expect(gd04Heindree031.ap).toBe(3);
    expect(gd04Heindree031.hp).toBe(2);
  });
});
