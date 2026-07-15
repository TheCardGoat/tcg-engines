import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { st04Ginn008 } from "./008-ginn.ts";

describe("Ginn (ST04-008)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [st04Ginn008] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(st04Ginn008.type).toBe("unit");
    expect(st04Ginn008.level).toBe(2);
    expect(st04Ginn008.cost).toBe(1);
    expect(st04Ginn008.ap).toBe(2);
    expect(st04Ginn008.hp).toBe(2);
  });
});
