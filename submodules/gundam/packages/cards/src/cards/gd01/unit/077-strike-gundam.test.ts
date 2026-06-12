import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd01StrikeGundam077 } from "./077-strike-gundam.ts";

describe("Strike Gundam (GD01-077)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd01StrikeGundam077] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd01StrikeGundam077.type).toBe("unit");
    expect(gd01StrikeGundam077.level).toBe(4);
    expect(gd01StrikeGundam077.cost).toBe(2);
    expect(gd01StrikeGundam077.ap).toBe(3);
    expect(gd01StrikeGundam077.hp).toBe(4);
  });
});
