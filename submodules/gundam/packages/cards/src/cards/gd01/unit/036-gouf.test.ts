import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd01Gouf036 } from "./036-gouf.ts";

describe("Gouf (GD01-036)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd01Gouf036] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd01Gouf036.type).toBe("unit");
    expect(gd01Gouf036.level).toBe(2);
    expect(gd01Gouf036.cost).toBe(2);
    expect(gd01Gouf036.ap).toBe(3);
    expect(gd01Gouf036.hp).toBe(2);
  });
});
