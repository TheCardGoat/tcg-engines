import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd02GundamX053 } from "./053-gundam-x.ts";

describe("Gundam X (GD02-053)", () => {
  it("data declares Suppression and a linked trash-gated Vulture AP+2 aura", () => {
    expect(gd02GundamX053.keywordEffects).toEqual([{ keyword: "Suppression" }]);
    expect(gd02GundamX053.effects?.[0]?.activation.conditions).toEqual([
      { type: "duringLink" },
      { type: "isTurn", whose: "friendly" },
      { type: "cardInZone", owner: "friendly", zone: "trash", comparison: "gte", count: 7 },
    ]);
  });

  it("buffs other friendly Vulture Units while linked with 7 cards in trash", () => {
    const garrod = createMockPilot({ name: "Garrod Ran", level: 1, cost: 1 });
    const ally = createMockUnit({ traits: ["vulture"], ap: 2, hp: 4 });
    const trash = Array.from({ length: 7 }, () => createMockUnit());
    const engine = GundamTestEngine.create({
      hand: [garrod],
      play: [gd02GundamX053, ally],
      trash,
      resourceArea: activeResources(7),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [gundamXId, allyId] = p1.getCardsInZone("battleArea");
    expectSuccess(p1.assignPilot(garrod, gd02GundamX053));
    const fw = engine.getRuntime().getFrameworkReadAPI();

    expect(getEffectiveStats(allyId!, engine.getG(), fw.cards, fw).ap).toBe(4);
    expect(getEffectiveStats(gundamXId!, engine.getG(), fw.cards, fw).ap).toBe(7);
  });
});
