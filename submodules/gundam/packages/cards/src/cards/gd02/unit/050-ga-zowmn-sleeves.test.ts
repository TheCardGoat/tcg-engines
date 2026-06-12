import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd02GaZowmnSleeves050 } from "./050-ga-zowmn-sleeves.ts";

describe("Ga-Zowmn (Sleeves) (GD02-050)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd02GaZowmnSleeves050] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd02GaZowmnSleeves050.type).toBe("unit");
    expect(gd02GaZowmnSleeves050.level).toBe(2);
    expect(gd02GaZowmnSleeves050.cost).toBe(2);
    expect(gd02GaZowmnSleeves050.ap).toBe(3);
    expect(gd02GaZowmnSleeves050.hp).toBe(2);
  });
});
