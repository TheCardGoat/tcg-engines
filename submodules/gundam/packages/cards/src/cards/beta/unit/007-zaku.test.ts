import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { betaZaku007 } from "./007-zaku.ts";

describe("Zaku Ⅰ (ST03-007)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [betaZaku007] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(betaZaku007.type).toBe("unit");
    expect(betaZaku007.level).toBe(1);
    expect(betaZaku007.cost).toBe(1);
    expect(betaZaku007.ap).toBe(1);
    expect(betaZaku007.hp).toBe(2);
  });
});
