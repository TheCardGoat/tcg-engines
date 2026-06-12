import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { st08MesserTypeFNakedCommanderType003 } from "./003-messer-type-f-naked-commander-type.ts";

describe("Messer (Type-F Naked) (Commander Type) (ST08-003)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [st08MesserTypeFNakedCommanderType003] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(st08MesserTypeFNakedCommanderType003.type).toBe("unit");
    expect(st08MesserTypeFNakedCommanderType003.level).toBe(4);
    expect(st08MesserTypeFNakedCommanderType003.cost).toBe(2);
    expect(st08MesserTypeFNakedCommanderType003.ap).toBe(4);
    expect(st08MesserTypeFNakedCommanderType003.hp).toBe(3);
  });
});
