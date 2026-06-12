import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd030Gundam063 } from "./063-0-gundam.ts";

describe("0 Gundam (GD03-063)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd030Gundam063] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd030Gundam063.type).toBe("unit");
    expect(gd030Gundam063.level).toBe(2);
    expect(gd030Gundam063.cost).toBe(1);
    expect(gd030Gundam063.ap).toBe(2);
    expect(gd030Gundam063.hp).toBe(2);
  });
});
