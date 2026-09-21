import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDyingNightVSPistol,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailGorillaArms,
  welcomeToNightCityRetailHeywoodRipperdoc,
  welcomeToNightCityRetailMandibularUpgrade,
  welcomeToNightCityRetailMantisBlades,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const heywood = welcomeToNightCityRetailHeywoodRipperdoc;

describe("Heywood Ripperdoc", () => {
  it("is the exact yellow Ripperdoc with an optional equipped-Gear defeat and conditional draw", () => {
    expect(heywood).toMatchObject({
      canonicalId: "heywood-ripperdoc",
      slug: "heywood-ripperdoc",
      name: "Heywood Ripperdoc",
      displayName: "Heywood Ripperdoc",
      type: "unit",
      color: "yellow",
      classifications: ["Ripperdoc"],
      cost: 6,
      power: 8,
      ram: 1,
      hasSellTag: false,
      timingTriggers: ["play"],
      printNumber: "047",
      rarity: "Uncommon",
      rulesText:
        "{Play} You may defeat a Gear. If its cost equals the value of a friendly Gig, draw 1.",
    });
    expect(heywood.abilities).toEqual([
      expect.objectContaining({
        trigger: { trigger: "play" },
        source: { selector: "self" },
        bindings: [
          {
            id: "selectedGear",
            target: {
              selector: "card",
              zones: ["field", "legendArea"],
              cardTypes: ["gear"],
              selection: { mode: "choose", min: 0, max: 1 },
            },
          },
        ],
        effects: [
          {
            effect: "defeat",
            target: { selector: "bound", id: "selectedGear" },
            optional: true,
          },
          {
            effect: "draw",
            player: "friendly",
            amount: 1,
            conditions: [
              {
                condition: "costMatchesGig",
                target: { selector: "bound", id: "selectedGear" },
                controller: "friendly",
              },
            ],
          },
        ],
      }),
    ]);
  });

  it("offers either player's equipped Gear but excludes Gear in private zones", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [heywood, welcomeToNightCityRetailMantisBlades],
        deck: [welcomeToNightCityRetailDyingNightVSPistol],
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            attachedGears: [welcomeToNightCityRetailMandibularUpgrade],
          },
        ],
        eddies: 6,
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailCorpoSecurity,
            attachedGears: [welcomeToNightCityRetailGorillaArms],
          },
        ],
      },
      { preserveDeckOrder: true },
    );

    engine.playCard(heywood, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected Gear choice.");
    expect(choice.chooserId).toBe(P1);
    expect(choice.payload).toMatchObject({ min: 0, max: 1, canDecline: true });
    expect(choice.payload.eligibleIds).toEqual(
      expect.arrayContaining([
        engine.findCardId(welcomeToNightCityRetailMandibularUpgrade, "field", P1),
        engine.findCardId(welcomeToNightCityRetailGorillaArms, "field", P2),
      ]),
    );
    expect(choice.payload.eligibleIds).toHaveLength(2);
    expect(choice.payload.eligibleIds).not.toContain(
      engine.findCardId(welcomeToNightCityRetailMantisBlades, "hand", P1),
    );
    expect(choice.payload.eligibleIds).not.toContain(
      engine.findCardId(welcomeToNightCityRetailDyingNightVSPistol, "deck", P1),
    );
    engine.resolveEffectTarget(welcomeToNightCityRetailGorillaArms, { as: P1 });

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      heywood.id,
    );
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailGorillaArms.id,
    );
  });

  it("defeats a chosen rival Gear and draws 1 when its printed cost matches a friendly Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [heywood],
        deck: [welcomeToNightCityRetailFieldOperator],
        eddies: 6,
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailCorpoSecurity,
            attachedGears: [welcomeToNightCityRetailMandibularUpgrade],
          },
        ],
      },
      { preserveDeckOrder: true },
    );

    engine.playCard(heywood, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailMandibularUpgrade, { as: P1 });

    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMandibularUpgrade.id,
    );
    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailFieldOperator.id,
    ]);
  });

  it("does not draw when the defeated Gear cost does not match a friendly Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [heywood],
        field: [welcomeToNightCityRetailFieldOperator],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 6,
        gigArea: [{ dieType: "d6", faceValue: 6 }],
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailCorpoSecurity,
            attachedGears: [welcomeToNightCityRetailMandibularUpgrade],
          },
        ],
      },
    );
    const handBefore = engine.getHandCount(P1);
    engine.playCard(heywood, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailMandibularUpgrade, { as: P1 });
    expect(engine.getHandCount(P1)).toBe(handBefore - 1);
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMandibularUpgrade.id,
    );
  });

  it("can decline to defeat a Gear", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [heywood],
      field: [
        {
          card: welcomeToNightCityRetailFieldOperator,
          attachedGears: [welcomeToNightCityRetailMandibularUpgrade],
        },
      ],
      eddies: 6,
    });

    engine.playCard(heywood, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected Gear choice.");
    engine.executeMove("resolveEffectTarget", { args: { targetIds: [], pass: true } }, P1);
    expect(
      engine.getCardsInZone("field", P1).some((card) => card.definitionId === heywood.id),
    ).toBe(true);
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMandibularUpgrade.id,
    );
  });

  it("does not draw from a matching rival Gig value", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [heywood],
        deck: [welcomeToNightCityRetailFieldOperator],
        eddies: 6,
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailCorpoSecurity,
            attachedGears: [welcomeToNightCityRetailMandibularUpgrade],
          },
        ],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      { preserveDeckOrder: true },
    );

    engine.playCard(heywood, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailMandibularUpgrade, { as: P1 });

    expect(engine.getHandCount(P1)).toBe(0);
  });

  it("can decline the empty optional prompt and does not draw when no equipped Gear exists", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [heywood, welcomeToNightCityRetailMantisBlades],
        deck: [welcomeToNightCityRetailFieldOperator],
        eddies: 6,
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(heywood, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget")
      throw new Error("Expected optional Gear choice.");
    expect(choice.payload).toMatchObject({ eligibleIds: [], min: 0, max: 1, canDecline: true });
    engine.executeMove("resolveEffectTarget", { args: { targetIds: [], pass: true } }, P1);

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailMantisBlades.id,
    ]);
  });
});
