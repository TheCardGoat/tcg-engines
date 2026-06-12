import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd02EinSSchwalbeGraze077 } from "./077-ein-s-schwalbe-graze.ts";

describe("Ein's Schwalbe Graze (GD02-077)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd02EinSSchwalbeGraze077] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd02EinSSchwalbeGraze077.type).toBe("unit");
    expect(gd02EinSSchwalbeGraze077.level).toBe(4);
    expect(gd02EinSSchwalbeGraze077.cost).toBe(2);
    expect(gd02EinSSchwalbeGraze077.ap).toBe(4);
    expect(gd02EinSSchwalbeGraze077.hp).toBe(3);
  });
});
