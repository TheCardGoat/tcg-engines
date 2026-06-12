import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { betaRezel018 } from "./018-rezel.ts";

describe("ReZEL (GD01-018)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [betaRezel018] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(betaRezel018.type).toBe("unit");
    expect(betaRezel018.level).toBe(3);
    expect(betaRezel018.cost).toBe(2);
    expect(betaRezel018.ap).toBe(4);
    expect(betaRezel018.hp).toBe(3);
  });
});
