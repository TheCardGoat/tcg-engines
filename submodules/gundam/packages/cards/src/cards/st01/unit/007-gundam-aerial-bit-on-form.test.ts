import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { st01GundamAerialBitOnForm007 } from "./007-gundam-aerial-bit-on-form.ts";

describe("Gundam Aerial (Bit on Form) (ST01-007)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [st01GundamAerialBitOnForm007] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(st01GundamAerialBitOnForm007.type).toBe("unit");
    expect(st01GundamAerialBitOnForm007.level).toBe(4);
    expect(st01GundamAerialBitOnForm007.cost).toBe(2);
    expect(st01GundamAerialBitOnForm007.ap).toBe(3);
    expect(st01GundamAerialBitOnForm007.hp).toBe(4);
  });
});
