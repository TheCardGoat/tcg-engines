import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd01Zaku035 } from "./035-zaku.ts";

describe("Zaku Ⅱ (GD01-035)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd01Zaku035] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd01Zaku035.type).toBe("unit");
    expect(gd01Zaku035.level).toBe(2);
    expect(gd01Zaku035.cost).toBe(1);
    expect(gd01Zaku035.ap).toBe(2);
    expect(gd01Zaku035.hp).toBe(2);
  });
});
