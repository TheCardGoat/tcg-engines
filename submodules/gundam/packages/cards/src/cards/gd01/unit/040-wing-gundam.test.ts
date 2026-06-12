import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd01WingGundam040 } from "./040-wing-gundam.ts";

describe("Wing Gundam (GD01-040)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd01WingGundam040] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd01WingGundam040.type).toBe("unit");
    expect(gd01WingGundam040.level).toBe(5);
    expect(gd01WingGundam040.cost).toBe(2);
    expect(gd01WingGundam040.ap).toBe(4);
    expect(gd01WingGundam040.hp).toBe(3);
  });
});
