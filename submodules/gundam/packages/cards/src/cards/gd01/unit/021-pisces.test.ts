import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd01Pisces021 } from "./021-pisces.ts";

describe("Pisces (GD01-021)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd01Pisces021] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd01Pisces021.type).toBe("unit");
    expect(gd01Pisces021.level).toBe(1);
    expect(gd01Pisces021.cost).toBe(1);
    expect(gd01Pisces021.ap).toBe(1);
    expect(gd01Pisces021.hp).toBe(2);
  });
});
