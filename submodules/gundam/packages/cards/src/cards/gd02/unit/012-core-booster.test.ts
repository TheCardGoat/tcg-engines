import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd02CoreBooster012 } from "./012-core-booster.ts";

describe("Core Booster (GD02-012)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd02CoreBooster012] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd02CoreBooster012.type).toBe("unit");
    expect(gd02CoreBooster012.level).toBe(2);
    expect(gd02CoreBooster012.cost).toBe(2);
    expect(gd02CoreBooster012.ap).toBe(2);
    expect(gd02CoreBooster012.hp).toBe(2);
  });
});
