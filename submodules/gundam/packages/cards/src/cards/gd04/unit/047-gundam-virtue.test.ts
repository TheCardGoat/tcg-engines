import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd04GundamVirtue047 } from "./047-gundam-virtue.ts";

describe("Gundam Virtue (GD04-047)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd04GundamVirtue047] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd04GundamVirtue047.type).toBe("unit");
    expect(gd04GundamVirtue047.level).toBe(3);
    expect(gd04GundamVirtue047.cost).toBe(1);
    expect(gd04GundamVirtue047.ap).toBe(3);
    expect(gd04GundamVirtue047.hp).toBe(1);
  });
});
