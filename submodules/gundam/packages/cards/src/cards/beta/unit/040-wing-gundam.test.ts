import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { betaWingGundam040 } from "./040-wing-gundam.ts";

describe("Wing Gundam (GD01-040)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [betaWingGundam040] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(betaWingGundam040.type).toBe("unit");
    expect(betaWingGundam040.level).toBe(5);
    expect(betaWingGundam040.cost).toBe(2);
    expect(betaWingGundam040.ap).toBe(4);
    expect(betaWingGundam040.hp).toBe(3);
  });
});
