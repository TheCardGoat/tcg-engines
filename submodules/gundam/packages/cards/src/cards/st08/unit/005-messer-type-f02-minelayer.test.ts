import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { st08MesserTypeF02Minelayer005 } from "./005-messer-type-f02-minelayer.ts";

describe("Messer Type-F02 Minelayer (ST08-005)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [st08MesserTypeF02Minelayer005] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(st08MesserTypeF02Minelayer005.type).toBe("unit");
    expect(st08MesserTypeF02Minelayer005.level).toBe(3);
    expect(st08MesserTypeF02Minelayer005.cost).toBe(2);
    expect(st08MesserTypeF02Minelayer005.ap).toBe(4);
    expect(st08MesserTypeF02Minelayer005.hp).toBe(3);
  });
});
