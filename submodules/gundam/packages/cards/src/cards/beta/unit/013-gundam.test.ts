import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { betaGundam013 } from "./013-gundam.ts";

describe("Gundam (GD01-013)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [betaGundam013] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(betaGundam013.type).toBe("unit");
    expect(betaGundam013.level).toBe(4);
    expect(betaGundam013.cost).toBe(2);
    expect(betaGundam013.ap).toBe(3);
    expect(betaGundam013.hp).toBe(4);
  });
});
