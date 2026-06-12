import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd03GundamAge1Flat031 } from "./031-gundam-age-1-flat.ts";

describe("Gundam AGE-1 Flat (GD03-031)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd03GundamAge1Flat031] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd03GundamAge1Flat031.type).toBe("unit");
    expect(gd03GundamAge1Flat031.level).toBe(4);
    expect(gd03GundamAge1Flat031.cost).toBe(2);
    expect(gd03GundamAge1Flat031.ap).toBe(4);
    expect(gd03GundamAge1Flat031.hp).toBe(3);
  });
});
