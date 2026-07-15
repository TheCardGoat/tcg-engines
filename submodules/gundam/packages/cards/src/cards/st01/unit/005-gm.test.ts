import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { st01Gm005 } from "./005-gm.ts";

describe("GM (ST01-005)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [st01Gm005] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(st01Gm005.type).toBe("unit");
    expect(st01Gm005.level).toBe(2);
    expect(st01Gm005.cost).toBe(1);
    expect(st01Gm005.ap).toBe(2);
    expect(st01Gm005.hp).toBe(2);
  });
});
