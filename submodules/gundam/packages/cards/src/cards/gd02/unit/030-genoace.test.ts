import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd02Genoace030 } from "./030-genoace.ts";

describe("Genoace (GD02-030)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd02Genoace030] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd02Genoace030.type).toBe("unit");
    expect(gd02Genoace030.level).toBe(1);
    expect(gd02Genoace030.cost).toBe(1);
    expect(gd02Genoace030.ap).toBe(1);
    expect(gd02Genoace030.hp).toBe(2);
  });
});
