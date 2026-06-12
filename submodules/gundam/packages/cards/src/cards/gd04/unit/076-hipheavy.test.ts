import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd04Hipheavy076 } from "./076-hipheavy.ts";

describe("Hipheavy (GD04-076)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd04Hipheavy076] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd04Hipheavy076.type).toBe("unit");
    expect(gd04Hipheavy076.level).toBe(1);
    expect(gd04Hipheavy076.cost).toBe(1);
    expect(gd04Hipheavy076.ap).toBe(1);
    expect(gd04Hipheavy076.hp).toBe(2);
  });
});
