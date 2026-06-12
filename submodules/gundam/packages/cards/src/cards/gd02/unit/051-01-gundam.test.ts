import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd0201Gundam051 } from "./051-01-gundam.ts";

describe("01 Gundam (GD02-051)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd0201Gundam051] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd0201Gundam051.type).toBe("unit");
    expect(gd0201Gundam051.level).toBe(2);
    expect(gd0201Gundam051.cost).toBe(2);
    expect(gd0201Gundam051.ap).toBe(2);
    expect(gd0201Gundam051.hp).toBe(3);
  });
});
