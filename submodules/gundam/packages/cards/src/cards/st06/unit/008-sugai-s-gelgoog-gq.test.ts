import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { st06SugaiSGelgoogGq008 } from "./008-sugai-s-gelgoog-gq.ts";

describe("Sugai's Gelgoog (GQ) (ST06-008)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [st06SugaiSGelgoogGq008] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(st06SugaiSGelgoogGq008.type).toBe("unit");
    expect(st06SugaiSGelgoogGq008.level).toBe(3);
    expect(st06SugaiSGelgoogGq008.cost).toBe(2);
    expect(st06SugaiSGelgoogGq008.ap).toBe(3);
    expect(st06SugaiSGelgoogGq008.hp).toBe(3);
  });
});
