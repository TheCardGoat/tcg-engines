import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd01BeguirPente084 } from "./084-beguir-pente.ts";

describe("Beguir-Pente (GD01-084)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd01BeguirPente084] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd01BeguirPente084.type).toBe("unit");
    expect(gd01BeguirPente084.level).toBe(2);
    expect(gd01BeguirPente084.cost).toBe(2);
    expect(gd01BeguirPente084.ap).toBe(2);
    expect(gd01BeguirPente084.hp).toBe(3);
  });
});
