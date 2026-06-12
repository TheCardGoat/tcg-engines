import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { betaStrikeDagger005 } from "./005-strike-dagger.ts";

describe("Strike Dagger (ST04-005)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [betaStrikeDagger005] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(betaStrikeDagger005.type).toBe("unit");
    expect(betaStrikeDagger005.level).toBe(2);
    expect(betaStrikeDagger005.cost).toBe(2);
    expect(betaStrikeDagger005.ap).toBe(3);
    expect(betaStrikeDagger005.hp).toBe(2);
  });
});
