import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailAfterpartyAtLizzieS,
  welcomeToNightCityRetailCorpoSecurity,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Afterparty at Lizzie's", () => {
  it("adjusts a Gig by up to 1 and draws 1 when friendly Gigs have distinct values", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailAfterpartyAtLizzieS],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 1,
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 6 },
        ],
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailAfterpartyAtLizzieS, { as: P1 });
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
      payload: { type: "adjustGig", source: { color: "yellow" } },
    });
    engine.resolveAdjustGig(2, { as: P1 });

    expect(engine.getGigDice(P1).find((die) => die.dieType === "d4")?.faceValue).toBe(2);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailAfterpartyAtLizzieS.id,
    );
  });

  it("can resolve without selecting a Gig and does not draw without distinct friendly values", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailAfterpartyAtLizzieS],
      deck: [welcomeToNightCityRetailCorpoSecurity],
      eddies: 1,
      gigArea: [{ dieType: "d4", faceValue: 1 }],
    });
    const handBefore = engine.getHandCount(P1);

    engine.playCard(welcomeToNightCityRetailAfterpartyAtLizzieS, { as: P1 });
    engine.resolveEffectTargetIds([], { as: P1 });

    expect(engine.getGigDice(P1).find((die) => die.dieType === "d4")?.faceValue).toBe(1);
    expect(engine.getHandCount(P1)).toBe(handBefore - 1);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
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
