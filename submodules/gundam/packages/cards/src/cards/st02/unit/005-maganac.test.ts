import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { st02Maganac005 } from "./005-maganac.ts";

describe("Maganac (ST02-005)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [st02Maganac005] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(st02Maganac005.type).toBe("unit");
    expect(st02Maganac005.level).toBe(2);
    expect(st02Maganac005.cost).toBe(2);
    expect(st02Maganac005.ap).toBe(3);
    expect(st02Maganac005.hp).toBe(2);
  });
});
