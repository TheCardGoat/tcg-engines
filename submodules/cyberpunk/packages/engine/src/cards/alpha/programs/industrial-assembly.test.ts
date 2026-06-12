import { describe, expect, it } from "vite-plus/test";
import { alphaIndustrialAssembly, alphaRuthlessLowlife } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Industrial Assembly", () => {
  it("increases a chosen friendly gig by 4 and draws when Street Cred becomes at least 7", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [alphaIndustrialAssembly],
      deck: [alphaRuthlessLowlife],
      eddies: 2,
      gigArea: [
        { dieType: "d8", faceValue: 3 },
        { dieType: "d6", faceValue: 1 },
      ],
    });

    const deckSizeBeforeEffect = engine.getCardsInZone("deck", P1).length;
    expect(engine.playCard(alphaIndustrialAssembly, { as: P1 })).toMatchObject({
      success: true,
    });
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseTarget");

    expect(
      engine.resolve(alphaIndustrialAssembly, { friendlyGig: "d8" }, { as: P1 }),
    ).toMatchObject({
      success: true,
    });

    const d8 = engine.getGigDice(P1).find((die) => die.dieType === "d8");
    expect(d8?.faceValue).toBe(7);
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(1);
    expect(engine.getCardsInZone("deck", P1)).toHaveLength(deckSizeBeforeEffect - 1);
    expect(
      engine
        .getCardsInZone("trash", P1)
        .some((card) => card.definitionId === alphaIndustrialAssembly.id),
    ).toBe(true);
  });

  it("does not draw when the modified gig leaves Street Cred below 7", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [alphaIndustrialAssembly],
      deck: [alphaRuthlessLowlife],
      eddies: 2,
      gigArea: [{ dieType: "d8", faceValue: 1 }],
    });

    const deckSizeBeforeEffect = engine.getCardsInZone("deck", P1).length;
    engine.playCard(alphaIndustrialAssembly, { as: P1 });
    engine.resolve(alphaIndustrialAssembly, { friendlyGig: "d8" }, { as: P1 });

    expect(engine.getGigDice(P1).find((die) => die.dieType === "d8")?.faceValue).toBe(5);
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(0);
    expect(engine.getCardsInZone("deck", P1)).toHaveLength(deckSizeBeforeEffect);
  });
});
