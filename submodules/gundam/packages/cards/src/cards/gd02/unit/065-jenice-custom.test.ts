import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd02JeniceCustom065 } from "./065-jenice-custom.ts";

describe("Jenice Custom (GD02-065)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd02JeniceCustom065] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd02JeniceCustom065.type).toBe("unit");
    expect(gd02JeniceCustom065.level).toBe(1);
    expect(gd02JeniceCustom065.cost).toBe(1);
    expect(gd02JeniceCustom065.ap).toBe(1);
    expect(gd02JeniceCustom065.hp).toBe(2);
  });
});
