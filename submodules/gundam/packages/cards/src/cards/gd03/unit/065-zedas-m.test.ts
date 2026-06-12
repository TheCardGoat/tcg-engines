import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd03ZedasM065 } from "./065-zedas-m.ts";

describe("Zedas M (GD03-065)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd03ZedasM065] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd03ZedasM065.type).toBe("unit");
    expect(gd03ZedasM065.level).toBe(3);
    expect(gd03ZedasM065.cost).toBe(2);
    expect(gd03ZedasM065.ap).toBe(3);
    expect(gd03ZedasM065.hp).toBe(3);
  });
});
