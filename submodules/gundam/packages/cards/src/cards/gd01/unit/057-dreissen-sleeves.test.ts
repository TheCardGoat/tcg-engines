import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd01DreissenSleeves057 } from "./057-dreissen-sleeves.ts";

describe("Dreissen (Sleeves) (GD01-057)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd01DreissenSleeves057] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd01DreissenSleeves057.type).toBe("unit");
    expect(gd01DreissenSleeves057.level).toBe(2);
    expect(gd01DreissenSleeves057.cost).toBe(2);
    expect(gd01DreissenSleeves057.ap).toBe(2);
    expect(gd01DreissenSleeves057.hp).toBe(3);
  });
});
