import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailAfterpartyAtLizzieS,
  welcomeToNightCityRetailCorpoSecurity,
} from "@tcg/cyberpunk-cards";
import {
  CyberpunkTestEngine,
  expectEligibleGigs,
  expectAdjustGigChoice,
  P1,
  P2,
} from "../../../testing/index.ts";

describe("Afterparty at Lizzie's", () => {
  /**
   * Oracle: "up to" permits choosing no Gig (CR 2.8), while a selected Gig
   * may change by at most one to a value on its faces (CR 6.4.1-5). The draw
   * condition is evaluated after that instruction in printed order (CR 10.2)
   * and counts only friendly Gigs with at least two distinct values.
   */
  it("pays 1, creates two distinct friendly values by adjusting +1, then draws 1", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailAfterpartyAtLizzieS],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 1,
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 1 },
        ],
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailAfterpartyAtLizzieS, { as: P1 });
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getPrompt(P1).choice).toMatchObject({
      type: "chooseTarget",
      payload: { type: "effectTarget", source: { color: "yellow" } },
    });
    engine.resolveEffectTargetIds([engine.findGigIdByType(P1, "d4")], {
      as: P1,
      allowPendingChoice: true,
      reason: "Afterparty still needs the selected Gig's new face value",
    });
    expect(engine.getPrompt(P1).choice).toMatchObject({
      type: "chooseTarget",
      payload: {
        type: "effectTarget",
        source: { color: "yellow" },
        adjustGig: { maxAmount: 1, direction: "either", chooseUpTo: true },
      },
    });
    engine.resolveAdjustGig(2, { as: P1 });

    expect(engine.getGigDice(P1).find((die) => die.dieType === "d4")?.faceValue).toBe(2);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailAfterpartyAtLizzieS.id,
    );
    engine.expectNoPendingChoice();
  });

  it("can adjust a rival Gig, rejects a change greater than 1 without mutation, then decreases it by 1", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailAfterpartyAtLizzieS],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 1,
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d8", faceValue: 2 },
        ],
      },
      { gigArea: [{ dieType: "d6", faceValue: 3 }] },
      { preserveDeckOrder: true },
    );
    const rivalGig = engine.findGigIdByType(P2, "d6");

    engine.playCard(welcomeToNightCityRetailAfterpartyAtLizzieS, { as: P1 });
    expectEligibleGigs(engine, [
      { dieType: "d4", as: P1 },
      { dieType: "d8", as: P1 },
      { dieType: "d6", as: P2 },
    ]);
    engine.resolveEffectTargetIds([rivalGig], {
      as: P1,
      allowPendingChoice: true,
      reason: "Afterparty still needs the rival Gig's new face value",
    });
    expectAdjustGigChoice(engine, { direction: "either", maxAmount: 1 });
    const excessive = engine.expectFailure(() => engine.resolveAdjustGig(5, { as: P1 }));
    expect(excessive.errorCode).toBe("EXCEEDS_MAX_AMOUNT");
    expect(engine.getGigDice(P2).find((die) => die.id === rivalGig)?.faceValue).toBe(3);
    engine.resolveAdjustGig(2, { as: P1 });

    expect(engine.getGigDice(P2).find((die) => die.id === rivalGig)?.faceValue).toBe(2);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    engine.expectNoPendingChoice();
  });

  it("does not draw when its adjustment collapses two friendly values into one", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailAfterpartyAtLizzieS],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 1,
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
        ],
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailAfterpartyAtLizzieS, { as: P1 });
    engine.resolveEffectTargetIds([engine.findGigIdByType(P1, "d4")], {
      as: P1,
      allowPendingChoice: true,
      reason: "Afterparty still needs the selected Gig's new face value",
    });
    engine.resolveAdjustGig(2, { as: P1 });

    expect(engine.getHandCount(P1)).toBe(0);
    expect(engine.getCardsInZone("deck", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    engine.expectNoPendingChoice();
  });

  it("can resolve without selecting a Gig and does not draw without distinct friendly values", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailAfterpartyAtLizzieS],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 1,
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        gigArea: [
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 3 },
        ],
      },
    );
    const handBefore = engine.getHandCount(P1);

    engine.playCard(welcomeToNightCityRetailAfterpartyAtLizzieS, { as: P1 });
    engine.resolveEffectTargetIds([], { as: P1 });

    expect(engine.getGigDice(P1).find((die) => die.dieType === "d4")?.faceValue).toBe(1);
    expect(engine.getHandCount(P1)).toBe(handBefore - 1);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    engine.expectNoPendingChoice();
  });

  it("requires choosing the Gig before showing adjust values even when only one Gig is eligible", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailAfterpartyAtLizzieS],
      deck: [welcomeToNightCityRetailCorpoSecurity],
      eddies: 1,
      gigArea: [{ dieType: "d4", faceValue: 1 }],
    });

    engine.playCard(welcomeToNightCityRetailAfterpartyAtLizzieS, { as: P1 });

    expect(engine.getPrompt(P1).choice).toMatchObject({
      type: "chooseTarget",
      payload: {
        type: "effectTarget",
        targetKind: "gig",
        eligibleIds: [engine.findGigIdByType(P1, "d4")],
        adjustGig: {
          direction: "either",
          maxAmount: 1,
          chooseUpTo: true,
        },
      },
    });
  });
});
