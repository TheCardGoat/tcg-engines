import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd01Gundam013 } from "./013-gundam.ts";

describe("Gundam (GD01-013)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd01Gundam013] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd01Gundam013.type).toBe("unit");
    expect(gd01Gundam013.level).toBe(4);
    expect(gd01Gundam013.cost).toBe(2);
    expect(gd01Gundam013.ap).toBe(3);
    expect(gd01Gundam013.hp).toBe(4);
  });
});
