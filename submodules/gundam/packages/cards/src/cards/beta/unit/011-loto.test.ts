import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { betaLoto011 } from "./011-loto.ts";

describe("Loto (GD01-011)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [betaLoto011] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(betaLoto011.type).toBe("unit");
    expect(betaLoto011.level).toBe(2);
    expect(betaLoto011.cost).toBe(2);
    expect(betaLoto011.ap).toBe(2);
    expect(betaLoto011.hp).toBe(2);
  });
});
