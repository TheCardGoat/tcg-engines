import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { st05Graze009 } from "./009-graze.ts";

describe("Graze (ST05-009)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [st05Graze009] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(st05Graze009.type).toBe("unit");
    expect(st05Graze009.level).toBe(2);
    expect(st05Graze009.cost).toBe(1);
    expect(st05Graze009.ap).toBe(2);
    expect(st05Graze009.hp).toBe(2);
  });
});
