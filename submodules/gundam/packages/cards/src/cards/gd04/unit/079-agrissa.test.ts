import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd04Agrissa079 } from "./079-agrissa.ts";

describe("Agrissa (GD04-079)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd04Agrissa079] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd04Agrissa079.type).toBe("unit");
    expect(gd04Agrissa079.level).toBe(5);
    expect(gd04Agrissa079.cost).toBe(3);
    expect(gd04Agrissa079.ap).toBe(5);
    expect(gd04Agrissa079.hp).toBe(4);
  });
});
