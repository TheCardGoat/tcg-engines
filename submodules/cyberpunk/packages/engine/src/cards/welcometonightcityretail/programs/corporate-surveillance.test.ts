import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailCorporateSurveillance,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailPsychoSquad,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const surveillance = welcomeToNightCityRetailCorporateSurveillance;

describe("Corporate Surveillance", () => {
  it("is a 2-cost green Corpo Program with RAM 1, a Sell Tag, and an exact mandatory Play effect", () => {
    expect(surveillance).toMatchObject({
      type: "program",
      color: "green",
      classifications: ["Corpo"],
      cost: 2,
      power: null,
      ram: 1,
      hasSellTag: true,
      timingTriggers: ["play"],
      reminderText: ["Discard programs after they resolve."],
    });
    expect(surveillance.abilities).toEqual([
      {
        kind: "triggered",
        text: "Spend a rival Unit with cost 4 or less.",
        trigger: { trigger: "play" },
        source: { selector: "self" },
        effects: [
          {
            effect: "spend",
            target: {
              selector: "card",
              controller: "rival",
              zones: ["field"],
              cardTypes: ["unit"],
              state: "ready",
              maxCost: 4,
              selection: { mode: "choose", min: 1, max: 1 },
            },
          },
        ],
      },
    ]);
  });

  it("must choose exactly one ready rival Unit at the inclusive cost-4 boundary and spend it", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [surveillance],
        field: [{ card: welcomeToNightCityRetailPsychoSquad, spent: false, hasLag: false }],
        legendArea: [],
        eddies: 2,
      },
      {
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, spent: false },
          { card: welcomeToNightCityRetailFieldOperator, spent: false },
          { card: welcomeToNightCityRetailPsychoSquad, spent: false, hasLag: false },
          { card: embracingPowerRetailStarterDeckMinotaur, spent: false, hasLag: false },
        ],
      },
    );

    expect(engine.playCard(surveillance, { as: P1 })).toMatchObject({ success: true });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected target choice.");
    expect(choice.payload).toMatchObject({
      targetKind: "card",
      min: 1,
      max: 1,
      canDecline: false,
    });
    const eligibleDefinitions = (choice.payload.eligibleIds ?? []).map(
      (id) => engine.getState().G.cardIndex[id]!.definitionId,
    );
    expect(eligibleDefinitions).toHaveLength(3);
    expect(eligibleDefinitions).toEqual(
      expect.arrayContaining([
        welcomeToNightCityRetailCorpoSecurity.id,
        welcomeToNightCityRetailFieldOperator.id,
        welcomeToNightCityRetailPsychoSquad.id,
      ]),
    );
    expect(eligibleDefinitions).not.toContain(embracingPowerRetailStarterDeckMinotaur.id);
    expect(choice.payload.eligibleIds).not.toContain(
      engine.findCardId(welcomeToNightCityRetailPsychoSquad, "field", P1),
    );

    engine.resolveEffectTarget(welcomeToNightCityRetailPsychoSquad, { as: P1 });

    expect(engine.getCard(welcomeToNightCityRetailPsychoSquad, "field", P2).meta.spent).toBe(true);
    expect(engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2).meta.spent).toBe(
      false,
    );
    expect(engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P2).meta.spent).toBe(
      false,
    );
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      surveillance.id,
    );
  });

  it("resolves and moves to trash when no ready rival Unit costs 4 or less", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [surveillance],
        legendArea: [],
        eddies: 2,
      },
      {
        field: [{ card: embracingPowerRetailStarterDeckMinotaur, spent: false }],
      },
    );

    engine.playCard(surveillance, { as: P1 });

    expect(engine.getPrompt(P1).choice).toBeNull();
    expect(engine.getCard(embracingPowerRetailStarterDeckMinotaur, "field", P2).meta.spent).toBe(
      false,
    );
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      surveillance.id,
    );
  });

  it("does not offer an already-spent rival Unit because it cannot be spent again", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [surveillance],
        legendArea: [],
        eddies: 2,
      },
      {
        field: [{ card: welcomeToNightCityRetailPsychoSquad, spent: true, hasLag: false }],
      },
    );

    engine.playCard(surveillance, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCard(welcomeToNightCityRetailPsychoSquad, "field", P2).meta.spent).toBe(true);
  });
});
