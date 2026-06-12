import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd01Skygrasper079 } from "./079-skygrasper.ts";

describe("Skygrasper (GD01-079)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd01Skygrasper079] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd01Skygrasper079.type).toBe("unit");
    expect(gd01Skygrasper079.level).toBe(2);
    expect(gd01Skygrasper079.cost).toBe(2);
    expect(gd01Skygrasper079.ap).toBe(2);
    expect(gd01Skygrasper079.hp).toBe(2);
  });
});
