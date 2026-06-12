import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd04Bigro027 } from "./027-bigro.ts";

describe("Bigro (GD04-027)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd04Bigro027] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd04Bigro027.type).toBe("unit");
    expect(gd04Bigro027.level).toBe(5);
    expect(gd04Bigro027.cost).toBe(3);
    expect(gd04Bigro027.ap).toBe(5);
    expect(gd04Bigro027.hp).toBe(4);
  });
});
