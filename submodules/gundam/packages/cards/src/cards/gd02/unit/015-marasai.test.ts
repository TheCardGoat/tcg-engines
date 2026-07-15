import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd02Marasai015 } from "./015-marasai.ts";

describe("Marasai (GD02-015)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd02Marasai015] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd02Marasai015.type).toBe("unit");
    expect(gd02Marasai015.level).toBe(3);
    expect(gd02Marasai015.cost).toBe(2);
    expect(gd02Marasai015.ap).toBe(3);
    expect(gd02Marasai015.hp).toBe(3);
  });
});
