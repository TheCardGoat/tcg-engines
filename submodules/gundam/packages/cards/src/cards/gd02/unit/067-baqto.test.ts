import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd02Baqto067 } from "./067-baqto.ts";

describe("Baqto (GD02-067)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd02Baqto067] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd02Baqto067.type).toBe("unit");
    expect(gd02Baqto067.level).toBe(2);
    expect(gd02Baqto067.cost).toBe(2);
    expect(gd02Baqto067.ap).toBe(2);
    expect(gd02Baqto067.hp).toBe(3);
  });
});
