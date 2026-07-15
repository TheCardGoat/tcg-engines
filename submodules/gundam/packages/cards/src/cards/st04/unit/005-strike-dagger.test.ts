import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { st04StrikeDagger005 } from "./005-strike-dagger.ts";

describe("Strike Dagger (ST04-005)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [st04StrikeDagger005] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(st04StrikeDagger005.type).toBe("unit");
    expect(st04StrikeDagger005.level).toBe(2);
    expect(st04StrikeDagger005.cost).toBe(2);
    expect(st04StrikeDagger005.ap).toBe(3);
    expect(st04StrikeDagger005.hp).toBe(2);
  });
});
