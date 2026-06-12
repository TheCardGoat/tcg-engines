import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd04GundamExia064 } from "./064-gundam-exia.ts";

describe("Gundam Exia (GD04-064)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd04GundamExia064] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd04GundamExia064.type).toBe("unit");
    expect(gd04GundamExia064.level).toBe(2);
    expect(gd04GundamExia064.cost).toBe(2);
    expect(gd04GundamExia064.ap).toBe(2);
    expect(gd04GundamExia064.hp).toBe(3);
  });
});
