import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd03ZGokE027 } from "./027-z-gok-e.ts";

describe("Z’Gok E (GD03-027)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd03ZGokE027] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd03ZGokE027.type).toBe("unit");
    expect(gd03ZGokE027.level).toBe(3);
    expect(gd03ZGokE027.cost).toBe(2);
    expect(gd03ZGokE027.ap).toBe(3);
    expect(gd03ZGokE027.hp).toBe(3);
  });
});
