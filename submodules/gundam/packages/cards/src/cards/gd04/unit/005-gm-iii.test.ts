import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd04GmIii005 } from "./005-gm-iii.ts";

describe("GM III (GD04-005)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd04GmIii005] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd04GmIii005.type).toBe("unit");
    expect(gd04GmIii005.level).toBe(2);
    expect(gd04GmIii005.cost).toBe(2);
    expect(gd04GmIii005.ap).toBe(3);
    expect(gd04GmIii005.hp).toBe(2);
  });
});
