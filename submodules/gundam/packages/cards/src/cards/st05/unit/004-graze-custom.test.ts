import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { st05GrazeCustom004 } from "./004-graze-custom.ts";

describe("Graze Custom (ST05-004)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [st05GrazeCustom004] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(st05GrazeCustom004.type).toBe("unit");
    expect(st05GrazeCustom004.level).toBe(2);
    expect(st05GrazeCustom004.cost).toBe(1);
    expect(st05GrazeCustom004.ap).toBe(2);
    expect(st05GrazeCustom004.hp).toBe(2);
  });
});
