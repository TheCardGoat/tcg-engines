import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd02GundamAirmasterFighterMode063 } from "./063-gundam-airmaster-fighter-mode.ts";

describe("Gundam Airmaster (Fighter Mode) (GD02-063)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd02GundamAirmasterFighterMode063] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd02GundamAirmasterFighterMode063.type).toBe("unit");
    expect(gd02GundamAirmasterFighterMode063.level).toBe(3);
    expect(gd02GundamAirmasterFighterMode063.cost).toBe(2);
    expect(gd02GundamAirmasterFighterMode063.ap).toBe(3);
    expect(gd02GundamAirmasterFighterMode063.hp).toBe(3);
  });
});
