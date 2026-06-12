import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd02RaiderGundamMaMode019 } from "./019-raider-gundam-ma-mode.ts";

describe("Raider Gundam (MA Mode) (GD02-019)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd02RaiderGundamMaMode019] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd02RaiderGundamMaMode019.type).toBe("unit");
    expect(gd02RaiderGundamMaMode019.level).toBe(4);
    expect(gd02RaiderGundamMaMode019.cost).toBe(2);
    expect(gd02RaiderGundamMaMode019.ap).toBe(4);
    expect(gd02RaiderGundamMaMode019.hp).toBe(3);
  });
});
