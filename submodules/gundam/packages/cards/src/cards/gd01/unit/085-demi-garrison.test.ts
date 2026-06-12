import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd01DemiGarrison085 } from "./085-demi-garrison.ts";

describe("Demi Garrison (GD01-085)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd01DemiGarrison085] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd01DemiGarrison085.type).toBe("unit");
    expect(gd01DemiGarrison085.level).toBe(2);
    expect(gd01DemiGarrison085.cost).toBe(1);
    expect(gd01DemiGarrison085.ap).toBe(2);
    expect(gd01DemiGarrison085.hp).toBe(2);
  });
});
