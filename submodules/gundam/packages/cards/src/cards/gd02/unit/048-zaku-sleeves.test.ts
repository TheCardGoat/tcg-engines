import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd02ZakuSleeves048 } from "./048-zaku-sleeves.ts";

describe("Zaku Ⅲ (Sleeves) (GD02-048)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd02ZakuSleeves048] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd02ZakuSleeves048.type).toBe("unit");
    expect(gd02ZakuSleeves048.level).toBe(3);
    expect(gd02ZakuSleeves048.cost).toBe(2);
    expect(gd02ZakuSleeves048.ap).toBe(4);
    expect(gd02ZakuSleeves048.hp).toBe(1);
  });
});
