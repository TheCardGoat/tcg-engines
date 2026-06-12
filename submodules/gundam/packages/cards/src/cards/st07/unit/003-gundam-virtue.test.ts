import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { st07GundamVirtue003 } from "./003-gundam-virtue.ts";

describe("Gundam Virtue (ST07-003)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [st07GundamVirtue003] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(st07GundamVirtue003.type).toBe("unit");
    expect(st07GundamVirtue003.level).toBe(5);
    expect(st07GundamVirtue003.cost).toBe(3);
    expect(st07GundamVirtue003.ap).toBe(5);
    expect(st07GundamVirtue003.hp).toBe(4);
  });
});
