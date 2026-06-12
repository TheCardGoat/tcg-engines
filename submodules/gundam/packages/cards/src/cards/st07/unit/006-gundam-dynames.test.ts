import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { st07GundamDynames006 } from "./006-gundam-dynames.ts";

describe("Gundam Dynames (ST07-006)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [st07GundamDynames006] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(st07GundamDynames006.type).toBe("unit");
    expect(st07GundamDynames006.level).toBe(3);
    expect(st07GundamDynames006.cost).toBe(2);
    expect(st07GundamDynames006.ap).toBe(3);
    expect(st07GundamDynames006.hp).toBe(3);
  });
});
