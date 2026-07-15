import { describe, expect, it } from "vite-plus/test";
import { CyberpunkTestEngine, P1, expectNoPendingChoice } from "@cyberpunk-engine/testing/index.ts";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailIndustrialAssembly,
} from "@tcg/cyberpunk-cards";

const industrial = welcomeToNightCityRetailIndustrialAssembly; // program, cost 1
// A unit stacked on top of the deck so we can observe the conditional draw.
const drawTarget = welcomeToNightCityRetailCorpoSecurity;

describe("Industrial Assembly", () => {
  it("{PLAY} increases a Gig by up to 4 and draws 1 when the boosted Gig reaches 8+", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [industrial],
        deck: [drawTarget],
        eddies: industrial.cost,
        gigArea: [{ dieType: "d8", faceValue: 7 }],
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(industrial, { as: P1 });
    engine.resolveEffectTargetIds([engine.findGigIdByType(P1, "d8")], {
      as: P1,
      allowPendingChoice: true,
      reason: "Industrial Assembly still needs the selected Gig's new face value",
    });
    // Increase the d8 from 7 to 8 (+1, within the max of 4) -> now an 8+ Gig exists.
    engine.resolveAdjustGig(8, { as: P1 });

    // Observable: the Gig's face value went up.
    expect(engine.getGigDice(P1).find((die) => die.dieType === "d8")?.faceValue).toBe(8);
    // Observable: the conditional draw fired because an 8+ friendly Gig now exists.
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      drawTarget.id,
    );
    // Observable: the Program trashed after resolving.
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      industrial.id,
    );
  });

  it("increases a Gig by the FULL +4 allowed by chooseUpTo", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [industrial],
      eddies: industrial.cost,
      // d12 starts at 4 -> +4 lands it on 8 (boundary check for chooseUpTo max).
      gigArea: [{ dieType: "d12", faceValue: 4 }],
    });

    engine.playCard(industrial, { as: P1 });
    engine.resolveEffectTargetIds([engine.findGigIdByType(P1, "d12")], {
      as: P1,
      allowPendingChoice: true,
      reason: "Industrial Assembly still needs the selected Gig's new face value",
    });
    // Apply the maximum allowed increase: 4 -> 8.
    engine.resolveAdjustGig(8, { as: P1 });

    // Observable: the Gig jumped by exactly +4, the cap for this card.
    expect(engine.getGigDice(P1).find((die) => die.dieType === "d12")?.faceValue).toBe(8);
    // No deck stacked -> no draw asserted here; we just confirm no leftover choice.
    expectNoPendingChoice(engine);
  });

  it("does NOT draw when no friendly Gig is 8+ (boost was below threshold / declined)", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [industrial],
        deck: [drawTarget],
        eddies: industrial.cost,
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      },
      {},
      { preserveDeckOrder: true },
    );
    const handBefore = engine.getHandCount(P1);

    engine.playCard(industrial, { as: P1 });
    // Decline to select a Gig (min: 0 selection); no Gig is boosted, none reaches 8+.
    engine.resolveEffectTargetIds([], { as: P1 });

    // Observable: the Gig stays at 2 (never adjusted, never 8+).
    expect(engine.getGigDice(P1).find((die) => die.dieType === "d4")?.faceValue).toBe(2);
    // Observable: Program left hand but no draw occurred (net -1, drawTarget not in hand).
    expect(engine.getHandCount(P1)).toBe(handBefore - 1);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).not.toContain(
      drawTarget.id,
    );
    // And the Program still went to trash after resolving.
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      industrial.id,
    );
  });
});
