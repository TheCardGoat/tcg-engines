import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd04Borjarnon078 } from "./078-borjarnon.ts";

describe("Borjarnon (GD04-078)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd04Borjarnon078] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd04Borjarnon078.type).toBe("unit");
    expect(gd04Borjarnon078.level).toBe(2);
    expect(gd04Borjarnon078.cost).toBe(1);
    expect(gd04Borjarnon078.ap).toBe(2);
    expect(gd04Borjarnon078.hp).toBe(2);
  });
});
