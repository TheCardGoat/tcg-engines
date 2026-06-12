import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd04HambrabiGq048 } from "./048-hambrabi-gq.ts";

describe("Hambrabi (GQ) (GD04-048)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd04HambrabiGq048] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd04HambrabiGq048.type).toBe("unit");
    expect(gd04HambrabiGq048.level).toBe(5);
    expect(gd04HambrabiGq048.cost).toBe(3);
    expect(gd04HambrabiGq048.ap).toBe(4);
    expect(gd04HambrabiGq048.hp).toBe(4);
  });
});
