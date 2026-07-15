import { describe, expect, it } from "vite-plus/test";
import { CyberpunkTestEngine, P1, expectNoPendingChoice } from "@cyberpunk-engine/testing/index.ts";
import {
  welcomeToNightCityRetailAfterpartyAtLizzieS,
  welcomeToNightCityRetailCorpoSecurity,
} from "@tcg/cyberpunk-cards";

const afterparty = welcomeToNightCityRetailAfterpartyAtLizzieS; // program, cost 1
// A unit stacked on top of the deck so we can observe the conditional draw.
const drawTarget = welcomeToNightCityRetailCorpoSecurity;

describe("Afterparty at Lizzie's", () => {
  it("{PLAY} increases a Gig by up to 1 and draws 1 when friendly Gigs have distinct values", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [afterparty],
        deck: [drawTarget],
        eddies: afterparty.cost,
        // Two Gigs with distinct starting values (1 and 6) -> condition met.
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 6 },
        ],
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(afterparty, { as: P1 });
    // First the Gig to adjust must be selected...
    engine.resolveEffectTargetIds([engine.findGigIdByType(P1, "d4")], {
      as: P1,
      allowPendingChoice: true,
      reason: "Afterparty still needs the selected Gig's new face value",
    });
    // ...then its new value (increase by the max of 1: 1 -> 2).
    engine.resolveAdjustGig(2, { as: P1 });

    // Observable: the selected Gig's face value moved up by 1.
    expect(engine.getGigDice(P1).find((die) => die.dieType === "d4")?.faceValue).toBe(2);
    // Observable: the conditional draw happened (distinct friendly values present).
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      drawTarget.id,
    );
    // Observable: the Program trashed after resolving.
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      afterparty.id,
    );
  });

  it("{PLAY} can DECREASE a Gig by 1 (either direction), still drawing with distinct values", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [afterparty],
        deck: [drawTarget],
        eddies: afterparty.cost,
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 6 },
        ],
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(afterparty, { as: P1 });
    engine.resolveEffectTargetIds([engine.findGigIdByType(P1, "d6")], {
      as: P1,
      allowPendingChoice: true,
      reason: "Afterparty still needs the selected Gig's new face value",
    });
    // Decrease the d6 from 6 down to 5 (the max -1 step in the "either" direction).
    engine.resolveAdjustGig(5, { as: P1 });

    // Observable: the selected Gig went DOWN by 1.
    expect(engine.getGigDice(P1).find((die) => die.dieType === "d6")?.faceValue).toBe(5);
    // Friendly values are now {1, 5} -> still distinct, so the draw fired.
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      drawTarget.id,
    );
  });

  it("does NOT draw when friendly Gigs lack distinct values (2 Gigs, same value)", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [afterparty],
        deck: [drawTarget],
        eddies: afterparty.cost,
        // Two Gigs but identical values -> hasDistinctGigValues is false.
        gigArea: [
          { dieType: "d4", faceValue: 2 },
          { dieType: "d6", faceValue: 2 },
        ],
      },
      {},
      { preserveDeckOrder: true },
    );
    const handBefore = engine.getHandCount(P1);

    engine.playCard(afterparty, { as: P1 });
    // Decline to adjust any Gig (min: 0 selection) -> nothing changes, no distinct values.
    engine.resolveEffectTargetIds([], { as: P1 });

    // Observable: Gigs untouched (both still 2, never distinct).
    expect(engine.getGigDice(P1).find((die) => die.dieType === "d4")?.faceValue).toBe(2);
    expect(engine.getGigDice(P1).find((die) => die.dieType === "d6")?.faceValue).toBe(2);
    // Observable: the Program left the hand but the draw did NOT fire (hand net -1, no drawTarget).
    expect(engine.getHandCount(P1)).toBe(handBefore - 1);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).not.toContain(
      drawTarget.id,
    );
    expectNoPendingChoice(engine);
  });
});
