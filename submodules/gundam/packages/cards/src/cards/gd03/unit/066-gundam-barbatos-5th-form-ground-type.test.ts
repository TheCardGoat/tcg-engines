import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd03GundamBarbatos5thFormGroundType066 } from "./066-gundam-barbatos-5th-form-ground-type.ts";

describe("Gundam Barbatos 5th Form (Ground Type) (GD03-066)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd03GundamBarbatos5thFormGroundType066] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd03GundamBarbatos5thFormGroundType066.type).toBe("unit");
    expect(gd03GundamBarbatos5thFormGroundType066.level).toBe(5);
    expect(gd03GundamBarbatos5thFormGroundType066.cost).toBe(3);
    expect(gd03GundamBarbatos5thFormGroundType066.ap).toBe(5);
    expect(gd03GundamBarbatos5thFormGroundType066.hp).toBe(4);
  });
});
