import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd01Rezel018 } from "./018-rezel.ts";

describe("ReZEL (GD01-018)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd01Rezel018] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd01Rezel018.type).toBe("unit");
    expect(gd01Rezel018.level).toBe(3);
    expect(gd01Rezel018.cost).toBe(2);
    expect(gd01Rezel018.ap).toBe(4);
    expect(gd01Rezel018.hp).toBe(3);
  });
});
