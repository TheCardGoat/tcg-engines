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
import { gd01Gundam001 } from "./001-gundam.ts";

describe("Gundam (GD01-001)", () => {
  it("grants Repair 1 to friendly White Base Team Units", () => {
    const ally = createMockUnit({ traits: ["white base team"], ap: 2, hp: 4 });
    const nonWbt = createMockUnit({ traits: ["earth federation"], ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({ play: [gd01Gundam001, ally, nonWbt] });
    const [gundamId, allyId, nonWbtId] = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea");
    const fw = engine.getRuntime().getFrameworkReadAPI();

    expect(getEffectiveStats(gundamId!, engine.getG(), fw.cards, fw).keywords).toContain("Repair");
    expect(getEffectiveStats(allyId!, engine.getG(), fw.cards, fw).keywords).toContain("Repair");
    expect(getEffectiveStats(nonWbtId!, engine.getG(), fw.cards, fw).keywords).not.toContain(
      "Repair",
    );
  });

  it("draws 1 when paired while 2 other friendly Units are in play", () => {
    const amuro = createMockPilot({ name: "Amuro Ray", level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [amuro],
      play: [gd01Gundam001, createMockUnit(), createMockUnit()],
      resourceArea: activeResources(4),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });

    expectSuccess(p1.assignPilot(amuro, gd01Gundam001));

    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore - 1);
  });
});
