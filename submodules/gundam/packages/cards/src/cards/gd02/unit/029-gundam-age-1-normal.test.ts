import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd02GundamAge1Normal029 } from "./029-gundam-age-1-normal.ts";

describe("Gundam AGE-1 Normal (GD02-029)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd02GundamAge1Normal029] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd02GundamAge1Normal029.type).toBe("unit");
    expect(gd02GundamAge1Normal029.level).toBe(3);
    expect(gd02GundamAge1Normal029.cost).toBe(2);
    expect(gd02GundamAge1Normal029.ap).toBe(3);
    expect(gd02GundamAge1Normal029.hp).toBe(3);
  });
});
