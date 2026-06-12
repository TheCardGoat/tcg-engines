import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd04SchuzrumGalluss040 } from "./040-schuzrum-galluss.ts";

describe("Schuzrum-Galluss (GD04-040)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd04SchuzrumGalluss040] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd04SchuzrumGalluss040.type).toBe("unit");
    expect(gd04SchuzrumGalluss040.level).toBe(4);
    expect(gd04SchuzrumGalluss040.cost).toBe(2);
    expect(gd04SchuzrumGalluss040.ap).toBe(4);
    expect(gd04SchuzrumGalluss040.hp).toBe(3);
  });
});
