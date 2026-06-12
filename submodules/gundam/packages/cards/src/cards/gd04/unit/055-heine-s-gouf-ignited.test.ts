import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd04HeineSGoufIgnited055 } from "./055-heine-s-gouf-ignited.ts";

describe("Heine's Gouf Ignited (GD04-055)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd04HeineSGoufIgnited055] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd04HeineSGoufIgnited055.type).toBe("unit");
    expect(gd04HeineSGoufIgnited055.level).toBe(5);
    expect(gd04HeineSGoufIgnited055.cost).toBe(3);
    expect(gd04HeineSGoufIgnited055.ap).toBe(5);
    expect(gd04HeineSGoufIgnited055.hp).toBe(4);
  });
});
