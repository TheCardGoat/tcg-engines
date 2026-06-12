import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, activeResources, expectSuccess } from "@tcg/gundam-engine";
import { st03Gouf009 } from "./009-gouf.ts";

describe("Gouf (ST03-009)", () => {
  it("【Deploy】 deploys 1 rested Zaku II token", () => {
    const engine = GundamTestEngine.create({
      hand: [st03Gouf009],
      resourceArea: activeResources(4),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const before = p1.getCardsInZone("battleArea").length;

    expectSuccess(p1.deployUnit(st03Gouf009));

    // Gouf + Zaku token → battleArea gains 2 units.
    expect(p1.getCardsInZone("battleArea").length).toBe(before + 2);
  });
});
