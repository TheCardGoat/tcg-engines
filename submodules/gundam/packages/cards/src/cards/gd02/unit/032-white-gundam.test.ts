import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd02WhiteGundam032 } from "./032-white-gundam.ts";

describe("White Gundam (GD02-032)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd02WhiteGundam032] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd02WhiteGundam032.type).toBe("unit");
    expect(gd02WhiteGundam032.level).toBe(3);
    expect(gd02WhiteGundam032.cost).toBe(2);
    expect(gd02WhiteGundam032.ap).toBe(3);
    expect(gd02WhiteGundam032.hp).toBe(3);
  });
});
