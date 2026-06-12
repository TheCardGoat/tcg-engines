import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { gd03UnionFlag082 } from "./082-union-flag.ts";

describe("Union Flag (GD03-082)", () => {
  it("deploys at cost 1 while you have 2 or more Superpower Bloc/UN Units in play", () => {
    const allyA = createMockUnit({ traits: ["superpower bloc"] });
    const allyB = createMockUnit({ traits: ["un"] });
    const engine = GundamTestEngine.create({
      hand: [gd03UnionFlag082],
      play: [allyA, allyB],
      resourceArea: [...restedResources(2), ...activeResources(1)],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd03UnionFlag082));

    expect(p1.getCardsInZone("battleArea")).toHaveLength(3);
  });
});
