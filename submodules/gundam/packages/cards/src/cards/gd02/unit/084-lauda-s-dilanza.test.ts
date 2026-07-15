import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd02LaudaSDilanza084 } from "./084-lauda-s-dilanza.ts";

describe("Lauda's Dilanza (GD02-084)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd02LaudaSDilanza084] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd02LaudaSDilanza084.type).toBe("unit");
    expect(gd02LaudaSDilanza084.level).toBe(2);
    expect(gd02LaudaSDilanza084.cost).toBe(2);
    expect(gd02LaudaSDilanza084.ap).toBe(1);
    expect(gd02LaudaSDilanza084.hp).toBe(3);
  });
});
