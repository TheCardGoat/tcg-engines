import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { st06GelgoogGq004 } from "./004-gelgoog-gq.ts";

describe("Gelgoog (GQ) (ST06-004)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [st06GelgoogGq004] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(st06GelgoogGq004.type).toBe("unit");
    expect(st06GelgoogGq004.level).toBe(2);
    expect(st06GelgoogGq004.cost).toBe(1);
    expect(st06GelgoogGq004.ap).toBe(2);
    expect(st06GelgoogGq004.hp).toBe(2);
  });
});
