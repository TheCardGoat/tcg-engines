import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { st04MoebiusZero003 } from "./003-moebius-zero.ts";

describe("Moebius Zero (ST04-003)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [st04MoebiusZero003] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(st04MoebiusZero003.type).toBe("unit");
    expect(st04MoebiusZero003.level).toBe(3);
    expect(st04MoebiusZero003.cost).toBe(2);
    expect(st04MoebiusZero003.ap).toBe(2);
    expect(st04MoebiusZero003.hp).toBe(4);
  });
});
