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
    const [nonMatchId, lalahId, fillerId] = p1.getCardsInZone("deck");

    expectSuccess(p1.deployUnit(gd02Elmeth020));

    const choice = p1.getBoardView().pendingChoice;
    expect(choice?.kind).toBe("deckLook");
    if (choice?.kind !== "deckLook") return;
    expect(choice.legalTutorCardIds).toEqual([lalahId]);
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: {
          0: { tutorCardId: lalahId, toBottom: [nonMatchId!, fillerId!] },
        },
      }),
    );

    expect(p1.getHand()).toContain(lalahId);
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
