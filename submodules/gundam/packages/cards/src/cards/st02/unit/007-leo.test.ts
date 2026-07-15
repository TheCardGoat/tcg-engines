import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { st02Leo007 } from "./007-leo.ts";

describe("Leo (ST02-007)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [st02Leo007] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(st02Leo007.type).toBe("unit");
    expect(st02Leo007.level).toBe(2);
    expect(st02Leo007.cost).toBe(2);
    expect(st02Leo007.ap).toBe(2);
    expect(st02Leo007.hp).toBe(2);
  });
});
