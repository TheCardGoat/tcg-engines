import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { betaStrikeGundam077 } from "./077-strike-gundam.ts";

describe("Strike Gundam (GD01-077)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [betaStrikeGundam077] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(betaStrikeGundam077.type).toBe("unit");
    expect(betaStrikeGundam077.level).toBe(4);
    expect(betaStrikeGundam077.cost).toBe(2);
    expect(betaStrikeGundam077.ap).toBe(3);
    expect(betaStrikeGundam077.hp).toBe(4);
  });
});
