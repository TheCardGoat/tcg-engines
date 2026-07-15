import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd02Hizack013 } from "./013-hizack.ts";

describe("Hizack (GD02-013)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd02Hizack013] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd02Hizack013.type).toBe("unit");
    expect(gd02Hizack013.level).toBe(2);
    expect(gd02Hizack013.cost).toBe(1);
    expect(gd02Hizack013.ap).toBe(2);
    expect(gd02Hizack013.hp).toBe(2);
  });
});
