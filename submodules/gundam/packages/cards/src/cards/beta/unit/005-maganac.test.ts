import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { betaMaganac005 } from "./005-maganac.ts";

describe("Maganac (ST02-005)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [betaMaganac005] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(betaMaganac005.type).toBe("unit");
    expect(betaMaganac005.level).toBe(2);
    expect(betaMaganac005.cost).toBe(2);
    expect(betaMaganac005.ap).toBe(3);
    expect(betaMaganac005.hp).toBe(2);
  });
});
