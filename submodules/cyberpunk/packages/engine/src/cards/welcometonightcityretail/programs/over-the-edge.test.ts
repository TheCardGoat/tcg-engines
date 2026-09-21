import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailEmergencyAtlus,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailOffdutyMalfini,
  welcomeToNightCityRetailOverTheEdge,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const overTheEdge = welcomeToNightCityRetailOverTheEdge;

describe("Over the Edge", () => {
  it("is the exact red 3-cost Merc Program with one mandatory defeat target", () => {
    expect(overTheEdge).toMatchObject({
      canonicalId: "over-the-edge",
      slug: "over-the-edge",
      name: "Over the Edge",
      displayName: "Over the Edge",
      type: "program",
      color: "red",
      classifications: ["Merc"],
      cost: 3,
      power: null,
      ram: 2,
      hasSellTag: true,
      printNumber: "034",
      timingTriggers: ["play"],
      rulesText: "Defeat a Unit with power equal to or less than the value of a friendly d20.",
      abilities: [
        {
          kind: "triggered",
          trigger: { trigger: "play" },
          source: { selector: "self" },
          effects: [
            {
              effect: "defeat",
              target: {
                selector: "card",
                zones: ["field"],
                cardTypes: ["unit"],
                maxPowerOfGigValueOf: {
                  selector: "gig",
                  controller: "friendly",
                  sides: "d20",
                },
                selection: { mode: "choose", min: 1, max: 1 },
              },
            },
          ],
        },
      ],
    });
  });

  it("pays 3 and offers friendly and rival Units at or below the friendly d20 value", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [overTheEdge],
        eddies: 3,
        gigArea: [{ dieType: "d20", faceValue: 3 }],
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }],
      },
      {
        field: [
          { card: welcomeToNightCityRetailSwordwiseHuscle, spent: false },
          { card: welcomeToNightCityRetailEmergencyAtlus, spent: false },
        ],
      },
    );

    engine.playCard(overTheEdge, { as: P1 });
    expect(engine.getEddies(P1)).toBe(0);
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice).toMatchObject({
      type: "chooseTarget",
      payload: { min: 1, max: 1, canDecline: false },
    });
    if (choice?.type !== "chooseTarget") throw new Error("Expected Unit target choice");
    expect(choice.payload.eligibleIds).toEqual(
      expect.arrayContaining([
        engine.findCardId(welcomeToNightCityRetailCorpoSecurity, "field", P1),
        engine.findCardId(welcomeToNightCityRetailSwordwiseHuscle, "field", P2),
      ]),
    );
    expect(choice.payload.eligibleIds).not.toContain(
      engine.findCardId(welcomeToNightCityRetailEmergencyAtlus, "field", P2),
    );

    engine.resolveEffectTarget(welcomeToNightCityRetailSwordwiseHuscle, { as: P1 });
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailSwordwiseHuscle.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      overTheEdge.id,
    );
  });

  it("includes the equal-power boundary", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [overTheEdge],
        eddies: 3,
        gigArea: [{ dieType: "d20", faceValue: 5 }],
      },
      { field: [{ card: welcomeToNightCityRetailOffdutyMalfini, spent: false }] },
    );

    engine.playCard(overTheEdge, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailOffdutyMalfini, { as: P1 });
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailOffdutyMalfini.id,
    );
  });

  it("checks every friendly d20 and uses the highest current value", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [overTheEdge],
        eddies: 3,
        gigArea: [{ dieType: "d20", faceValue: 3 }],
      },
      { field: [{ card: welcomeToNightCityRetailOffdutyMalfini, spent: false }] },
    );
    engine.judgeAddGigDie(P1, "d20", 5, { id: "stolen-friendly-d20", as: P1 });

    engine.playCard(overTheEdge, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailOffdutyMalfini, { as: P1 });
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailOffdutyMalfini.id,
    );
  });

  it("ignores a rival d20 and resolves with no target when no friendly d20 exists", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [overTheEdge], eddies: 3 },
      {
        gigArea: [{ dieType: "d20", faceValue: 20 }],
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }],
      },
    );

    expect(engine.playCard(overTheEdge, { as: P1 })).toMatchObject({ success: true });
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2)).toBeDefined();
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      overTheEdge.id,
    );
  });

  it("uses effective power, including equipped Gear, when determining eligibility", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [overTheEdge],
        eddies: 3,
        gigArea: [{ dieType: "d20", faceValue: 3 }],
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            attachedGears: [welcomeToNightCityRetailMantisBlades],
          },
        ],
      },
    );

    engine.playCard(overTheEdge, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P2)).toBeDefined();
  });
});
