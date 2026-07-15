import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd02GuncannonGq052 } from "./052-guncannon-gq.ts";

describe("Guncannon (GQ) (GD02-052)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd02GuncannonGq052] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd02GuncannonGq052.type).toBe("unit");
    expect(gd02GuncannonGq052.level).toBe(2);
    expect(gd02GuncannonGq052.cost).toBe(2);
    expect(gd02GuncannonGq052.ap).toBe(3);
    expect(gd02GuncannonGq052.hp).toBe(2);
  });
});
