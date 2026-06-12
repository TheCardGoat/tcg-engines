import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd02AbdulSMaganac028 } from "./028-abdul-s-maganac.ts";

describe("Abdul's Maganac (GD02-028)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd02AbdulSMaganac028] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd02AbdulSMaganac028.type).toBe("unit");
    expect(gd02AbdulSMaganac028.level).toBe(3);
    expect(gd02AbdulSMaganac028.cost).toBe(2);
    expect(gd02AbdulSMaganac028.ap).toBe(3);
    expect(gd02AbdulSMaganac028.hp).toBe(3);
  });
});
