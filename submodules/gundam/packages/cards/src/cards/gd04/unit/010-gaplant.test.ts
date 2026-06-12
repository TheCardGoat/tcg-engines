import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd04Gaplant010 } from "./010-gaplant.ts";

describe("Gaplant (GD04-010)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd04Gaplant010] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd04Gaplant010.type).toBe("unit");
    expect(gd04Gaplant010.level).toBe(4);
    expect(gd04Gaplant010.cost).toBe(2);
    expect(gd04Gaplant010.ap).toBe(3);
    expect(gd04Gaplant010.hp).toBe(4);
  });
});
