import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { st07GundamExia002 } from "./002-gundam-exia.ts";

describe("Gundam Exia (ST07-002)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [st07GundamExia002] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(st07GundamExia002.type).toBe("unit");
    expect(st07GundamExia002.level).toBe(4);
    expect(st07GundamExia002.cost).toBe(2);
    expect(st07GundamExia002.ap).toBe(4);
    expect(st07GundamExia002.hp).toBe(3);
  });
});
