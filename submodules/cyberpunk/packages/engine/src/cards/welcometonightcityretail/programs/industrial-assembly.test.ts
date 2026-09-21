import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailIndustrialAssembly,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const industrialAssembly = welcomeToNightCityRetailIndustrialAssembly;

describe("Industrial Assembly", () => {
  it("is the exact red Arasaka Braindance Program with an optional +4 Gig adjustment and 8+ draw", () => {
    expect(industrialAssembly).toMatchObject({
      canonicalId: "industrial-assembly",
      slug: "industrial-assembly",
      name: "Industrial Assembly",
      displayName: "Industrial Assembly",
      type: "program",
      color: "red",
      classifications: ["Arasaka", "Braindance"],
      cost: 1,
      power: null,
      ram: 1,
      hasSellTag: true,
      timingTriggers: ["play"],
      printNumber: "033",
      rarity: "Uncommon",
      rulesText: "Increase a Gig by up to 4. If you control a Gig with 8+ value, draw 1.",
      reminderText: ["Discard programs after they resolve."],
    });
    expect(industrialAssembly.abilities).toEqual([
      expect.objectContaining({
        trigger: { trigger: "play" },
        source: { selector: "self" },
        bindings: [
          {
            id: "selectedGig",
            target: {
              selector: "gig",
              amount: 1,
              selection: { mode: "choose", min: 0, max: 1 },
            },
          },
        ],
        effects: [
          {
            effect: "adjustGig",
            target: { selector: "bound", id: "selectedGig" },
            maxAmount: 4,
            direction: "increase",
            chooseUpTo: true,
          },
          {
            effect: "draw",
            player: "friendly",
            amount: 1,
            conditions: [
              {
                condition: "targetExists",
                target: { selector: "gig", controller: "friendly", minValue: 8 },
              },
            ],
          },
        ],
      }),
    ]);
  });

  it("increases a friendly Gig, draws at 8+, and discards after resolving", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [industrialAssembly],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 1,
        gigArea: [{ dieType: "d8", faceValue: 7 }],
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(industrialAssembly, { as: P1 });
    engine.resolveEffectTargetIds([engine.findGigIdByType(P1, "d8")], {
      as: P1,
      allowPendingChoice: true,
      reason: "Industrial Assembly still needs the selected Gig's new face value",
    });
    engine.resolveAdjustGig(8, { as: P1 });

    expect(engine.getGigDice(P1)[0]?.faceValue).toBe(8);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailCorpoSecurity.id,
    ]);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      industrialAssembly.id,
    );
  });

  it("may increase a rival Gig but does not draw for the rival's 8+ value", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [industrialAssembly],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 1,
        gigArea: [{ dieType: "d8", faceValue: 7 }],
      },
      { gigArea: [{ dieType: "d8", faceValue: 4 }] },
      { preserveDeckOrder: true },
    );

    engine.playCard(industrialAssembly, { as: P1 });
    engine.resolveEffectTargetIds([engine.findGigIdByType(P2, "d8")], {
      as: P1,
      allowPendingChoice: true,
      reason: "Industrial Assembly still needs the rival Gig's new face value",
    });
    engine.resolveAdjustGig(8, { as: P1 });

    expect(engine.getGigDice(P2)[0]?.faceValue).toBe(8);
    expect(engine.getHandCount(P1)).toBe(0);
  });

  it("allows a zero increase and still draws for an existing friendly value 8", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [industrialAssembly],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 1,
        gigArea: [{ dieType: "d8", faceValue: 8 }],
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(industrialAssembly, { as: P1 });
    engine.resolveEffectTargetIds([engine.findGigIdByType(P1, "d8")], {
      as: P1,
      allowPendingChoice: true,
      reason: "Industrial Assembly permits choosing zero as the increase",
    });
    engine.resolveAdjustGig(8, { as: P1 });

    expect(engine.getGigDice(P1)[0]?.faceValue).toBe(8);
    expect(engine.getHandCount(P1)).toBe(1);
  });

  it("rejects decreasing or increasing by more than 4 before accepting +4", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [industrialAssembly],
      eddies: 1,
      gigArea: [{ dieType: "d12", faceValue: 5 }],
    });

    engine.playCard(industrialAssembly, { as: P1 });
    engine.resolveEffectTargetIds([engine.findGigIdByType(P1, "d12")], {
      as: P1,
      allowPendingChoice: true,
      reason: "Industrial Assembly still needs the selected Gig's new face value",
    });
    expect(engine.expectFailure(() => engine.resolveAdjustGig(4, { as: P1 })).errorCode).toBe(
      "WRONG_DIRECTION",
    );
    expect(engine.expectFailure(() => engine.resolveAdjustGig(10, { as: P1 })).errorCode).toBe(
      "EXCEEDS_MAX_AMOUNT",
    );
    engine.resolveAdjustGig(9, { as: P1 });
    expect(engine.getGigDice(P1)[0]?.faceValue).toBe(9);
  });

  it("rejects an increase beyond the selected die's highest face", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [industrialAssembly],
      eddies: 1,
      gigArea: [{ dieType: "d6", faceValue: 5 }],
    });

    engine.playCard(industrialAssembly, { as: P1 });
    engine.resolveEffectTargetIds([engine.findGigIdByType(P1, "d6")], {
      as: P1,
      allowPendingChoice: true,
      reason: "Industrial Assembly still needs the selected Gig's new face value",
    });
    expect(engine.expectFailure(() => engine.resolveAdjustGig(7, { as: P1 })).errorCode).toBe(
      "VALUE_OUT_OF_RANGE",
    );
    engine.resolveAdjustGig(6, { as: P1 });
    expect(engine.getGigDice(P1)[0]?.faceValue).toBe(6);
  });

  it("may choose no Gig and does not draw without a friendly 8+ Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [industrialAssembly],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 1,
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(industrialAssembly, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected optional Gig choice.");
    expect(choice.payload).toMatchObject({ eligibleIds: [], min: 0, max: 1, canDecline: true });
    engine.declineAdjustGig({ as: P1 });

    expect(engine.getHandCount(P1)).toBe(0);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      industrialAssembly.id,
    );
  });
});
