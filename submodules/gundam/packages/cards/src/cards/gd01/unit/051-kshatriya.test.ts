import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd01Kshatriya051 } from "./051-kshatriya.ts";

describe("Kshatriya (GD01-051)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd01Kshatriya051] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd01Kshatriya051.type).toBe("unit");
    expect(gd01Kshatriya051.level).toBe(4);
    expect(gd01Kshatriya051.cost).toBe(2);
    expect(gd01Kshatriya051.ap).toBe(3);
    expect(gd01Kshatriya051.hp).toBe(4);
  });
});
