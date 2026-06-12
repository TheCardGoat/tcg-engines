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
import { gd02Elmeth020 } from "./020-elmeth.ts";

describe("Elmeth (GD02-020)", () => {
  it("deploy tutors a green Zeon Pilot from the top 5", () => {
    const lalah = createMockPilot({ color: "green", traits: ["zeon"] });
    const nonMatch = createMockUnit({ traits: ["zeon"] });
    const engine = GundamTestEngine.create({
      hand: [gd02Elmeth020],
      resourceArea: activeResources(6),
      deck: [nonMatch, lalah, createMockUnit()],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd02Elmeth020));

    expect(p1.getHand().some((id) => id.includes(`_${lalah.cardNumber}_`))).toBe(true);
  });

  it("gets AP+2 while linked", () => {
    const lalah = createMockPilot({ name: "Lalah Sune", level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [lalah],
      play: [gd02Elmeth020],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [elmethId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(lalah, gd02Elmeth020));

    const fw = engine.getRuntime().getFrameworkReadAPI();
    expect(getEffectiveStats(elmethId!, engine.getG(), fw.cards, fw).ap).toBe(7);
  });
});
