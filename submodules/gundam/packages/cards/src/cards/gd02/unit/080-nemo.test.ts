import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd02Nemo080 } from "./080-nemo.ts";

describe("Nemo (GD02-080)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd02Nemo080] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd02Nemo080.type).toBe("unit");
    expect(gd02Nemo080.level).toBe(2);
    expect(gd02Nemo080.cost).toBe(1);
    expect(gd02Nemo080.ap).toBe(2);
    expect(gd02Nemo080.hp).toBe(2);
  });
});
