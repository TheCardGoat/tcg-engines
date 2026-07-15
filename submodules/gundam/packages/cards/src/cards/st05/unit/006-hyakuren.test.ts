import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { st05Hyakuren006 } from "./006-hyakuren.ts";

describe("Hyakuren (ST05-006)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [st05Hyakuren006] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(st05Hyakuren006.type).toBe("unit");
    expect(st05Hyakuren006.level).toBe(3);
    expect(st05Hyakuren006.cost).toBe(2);
    expect(st05Hyakuren006.ap).toBe(4);
    expect(st05Hyakuren006.hp).toBe(3);
  });
});
