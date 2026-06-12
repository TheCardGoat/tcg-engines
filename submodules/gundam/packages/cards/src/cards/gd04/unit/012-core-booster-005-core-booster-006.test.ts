import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd04CoreBooster005CoreBooster006012 } from "./012-core-booster-005-core-booster-006.ts";

describe("Core Booster (005) & Core Booster (006) (GD04-012)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd04CoreBooster005CoreBooster006012] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd04CoreBooster005CoreBooster006012.type).toBe("unit");
    expect(gd04CoreBooster005CoreBooster006012.level).toBe(3);
    expect(gd04CoreBooster005CoreBooster006012.cost).toBe(2);
    expect(gd04CoreBooster005CoreBooster006012.ap).toBe(3);
    expect(gd04CoreBooster005CoreBooster006012.hp).toBe(3);
  });
});
