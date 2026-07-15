import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { st06RedGundam006 } from "./006-red-gundam.ts";

describe("Red Gundam (ST06-006)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [st06RedGundam006] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(st06RedGundam006.type).toBe("unit");
    expect(st06RedGundam006.level).toBe(4);
    expect(st06RedGundam006.cost).toBe(2);
    expect(st06RedGundam006.ap).toBe(3);
    expect(st06RedGundam006.hp).toBe(4);
  });
});
