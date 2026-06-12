import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd03DinnCommanderType047 } from "./047-dinn-commander-type.ts";

describe("DINN (Commander Type) (GD03-047)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd03DinnCommanderType047] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd03DinnCommanderType047.type).toBe("unit");
    expect(gd03DinnCommanderType047.level).toBe(4);
    expect(gd03DinnCommanderType047.cost).toBe(2);
    expect(gd03DinnCommanderType047.ap).toBe(3);
    expect(gd03DinnCommanderType047.hp).toBe(4);
  });
});
