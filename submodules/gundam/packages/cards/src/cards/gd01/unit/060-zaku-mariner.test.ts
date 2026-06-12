import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd01ZakuMariner060 } from "./060-zaku-mariner.ts";

describe("Zaku Mariner (GD01-060)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd01ZakuMariner060] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd01ZakuMariner060.type).toBe("unit");
    expect(gd01ZakuMariner060.level).toBe(2);
    expect(gd01ZakuMariner060.cost).toBe(1);
    expect(gd01ZakuMariner060.ap).toBe(2);
    expect(gd01ZakuMariner060.hp).toBe(2);
  });
});
