import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { st08Penelope007 } from "./007-penelope.ts";

describe("Penelope (ST08-007)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [st08Penelope007] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(st08Penelope007.type).toBe("unit");
    expect(st08Penelope007.level).toBe(5);
    expect(st08Penelope007.cost).toBe(3);
    expect(st08Penelope007.ap).toBe(5);
    expect(st08Penelope007.hp).toBe(4);
  });
});
