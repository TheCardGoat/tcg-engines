import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailCarnageAtTheColosseum,
  welcomeToNightCityRetailRoycePsychoOnTheEdge,
  welcomeToNightCityRetailTBugAmateurPhilosopher,
} from "@tcg/cyberpunk-cards";
import { computeEffectiveCost } from "../../moves/compute-effective-cost.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../testing/index.ts";

describe("Carnage At The Colosseum", () => {
  it("is a 6-cost red Braindance Extreme Program with RAM 3 and a Sell Tag", () => {
    expect(welcomeToNightCityRetailCarnageAtTheColosseum).toMatchObject({
      type: "program",
      color: "red",
      classifications: ["Braindance", "Extreme"],
      cost: 6,
      power: null,
      ram: 3,
      hasSellTag: true,
      timingTriggers: ["play"],
      reminderText: ["Discard programs after they resolve."],
      costModifier: {
        reducer: "perTargetCount",
        reductionPerCount: 1,
        min: 1,
        target: { selector: "gig", controller: "friendly", amount: "all", minValue: 8 },
      },
    });
    expect(welcomeToNightCityRetailCarnageAtTheColosseum.abilities).toHaveLength(1);
  });

  it("defeats a rival unit with less power than a friendly unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailCarnageAtTheColosseum],
        field: [embracingPowerRetailStarterDeckMinotaur],
        eddies: 6,
      },
      {
        field: [welcomeToNightCityRetailCorpoSecurity],
      },
    );

    engine.playCard(welcomeToNightCityRetailCarnageAtTheColosseum, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice).toMatchObject({
      type: "chooseTarget",
      payload: { min: 1, max: 1 },
    });
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCarnageAtTheColosseum.id,
    );
  });

  it("does not offer a rival unit that is not weaker than a friendly unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailCarnageAtTheColosseum],
        field: [welcomeToNightCityRetailTBugAmateurPhilosopher],
        eddies: 6,
      },
      {
        field: [
          embracingPowerRetailStarterDeckMinotaur,
          welcomeToNightCityRetailTBugAmateurPhilosopher,
          welcomeToNightCityRetailCorpoSecurity,
        ],
      },
    );

    engine.playCard(welcomeToNightCityRetailCarnageAtTheColosseum, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected target choice.");
    const eligibleDefinitions = (choice.payload.eligibleIds ?? []).map(
      (id) => engine.getState().G.cardIndex[id]!.definitionId,
    );
    expect(eligibleDefinitions).toContain(welcomeToNightCityRetailCorpoSecurity.id);
    expect(eligibleDefinitions).not.toContain(embracingPowerRetailStarterDeckMinotaur.id);
    expect(eligibleDefinitions).not.toContain(welcomeToNightCityRetailTBugAmateurPhilosopher.id);
  });

  it("uses effective power for both the friendly comparison and rival target", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailCarnageAtTheColosseum],
        field: [
          {
            card: welcomeToNightCityRetailCorpoSecurity,
            powerModifier: 3,
          },
        ],
        eddies: 6,
      },
      {
        field: [
          welcomeToNightCityRetailTBugAmateurPhilosopher,
          {
            card: welcomeToNightCityRetailCorpoSecurity,
            powerModifier: 4,
          },
        ],
      },
    );

    engine.playCard(welcomeToNightCityRetailCarnageAtTheColosseum, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected target choice.");
    const eligibleDefinitions = (choice.payload.eligibleIds ?? []).map(
      (id) => engine.getState().G.cardIndex[id]!.definitionId,
    );
    expect(eligibleDefinitions).toContain(welcomeToNightCityRetailTBugAmateurPhilosopher.id);
    expect(eligibleDefinitions).not.toContain(welcomeToNightCityRetailCorpoSecurity.id);
  });

  // CR 4.2.1 — a Legend on the field is also a Unit. Reported 2026-10-02: a
  // Go-Solo'd rival legend could not be targeted.
  it("offers a rival Go-Solo legend on the field and removes it from the game on defeat", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailCarnageAtTheColosseum],
        field: [embracingPowerRetailStarterDeckMinotaur],
        eddies: 6,
      },
      {
        legendArea: [{ card: welcomeToNightCityRetailRoycePsychoOnTheEdge, faceDown: false }],
        eddies: 9,
      },
    );

    // Pay the legend onto the field on the rival's own turn (Go Solo), then
    // hand the turn back so P1 can play the Program against it.
    engine.completeTurn({ as: P1 });
    const legendInstance = engine
      .getState()
      .G.players[P2].zones.legendArea.map((id) => engine.getState().G.cardIndex[id])
      .find((card) => card?.definitionId === welcomeToNightCityRetailRoycePsychoOnTheEdge.id);
    expect(
      engine.executeMove("goSolo", { args: { cardId: legendInstance!.instanceId as string } }, P2),
    ).toMatchObject({ success: true });
    engine.completeTurn({ as: P2 });

    engine.playCard(welcomeToNightCityRetailCarnageAtTheColosseum, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected target choice.");
    expect(choice.payload.eligibleIds).toContain(legendInstance!.instanceId);

    engine.resolveEffectTarget(welcomeToNightCityRetailRoycePsychoOnTheEdge, { as: P1 });
    const state = engine.getState();
    expect(
      state.G.players[P2].zones.field.map((id) => state.G.cardIndex[id]?.definitionId),
    ).not.toContain(welcomeToNightCityRetailRoycePsychoOnTheEdge.id);
    // Go Solo: "If it leaves the field, remove it from the game."
    expect(
      state.G.players[P2].zones.removedFromGame?.map((id) => state.G.cardIndex[id]?.definitionId),
    ).toContain(welcomeToNightCityRetailRoycePsychoOnTheEdge.id);
  });

  it("counts a friendly Go-Solo legend on the field as the power reference", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailCarnageAtTheColosseum],
        legendArea: [{ card: welcomeToNightCityRetailRoycePsychoOnTheEdge, faceDown: false }],
        eddies: 12,
      },
      {
        field: [
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailTBugAmateurPhilosopher,
        ],
      },
    );
    const ownLegend = engine
      .getState()
      .G.players[P1].zones.legendArea.map((id) => engine.getState().G.cardIndex[id])
      .find((card) => card?.definitionId === welcomeToNightCityRetailRoycePsychoOnTheEdge.id);
    expect(
      engine.executeMove("goSolo", { args: { cardId: ownLegend!.instanceId as string } }, P1),
    ).toMatchObject({ success: true });

    // Discriminating rival pair: with Royce (6 power) as the reference, both
    // weaker rivals must be offered — Corpo Security (2) and T-Bug (4).
    // Against any reference ≤ 4, T-Bug would have to drop off the list, so
    // this pins the actual power comparison instead of proving 2 < something.
    engine.playCard(welcomeToNightCityRetailCarnageAtTheColosseum, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected target choice.");
    const eligible = choice.payload.eligibleIds ?? [];
    expect(eligible).toContain(
      engine.findCardId(welcomeToNightCityRetailCorpoSecurity, "field", P2),
    );
    expect(eligible).toContain(
      engine.findCardId(welcomeToNightCityRetailTBugAmateurPhilosopher, "field", P2),
    );
  });

  it("reduces its cost only for friendly Gigs at the inclusive value-8 threshold", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailCarnageAtTheColosseum],
      eddies: 5,
      gigArea: [
        { dieType: "d8", faceValue: 7 },
        { dieType: "d10", faceValue: 8 },
      ],
    });
    const cardId = engine.findCardId(welcomeToNightCityRetailCarnageAtTheColosseum, "hand", P1);

    expect(computeEffectiveCost(engine.getState(), cardId, P1)).toBe(5);
    engine.playCard(welcomeToNightCityRetailCarnageAtTheColosseum, { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCarnageAtTheColosseum.id,
    );
  });

  it("does not reduce its cost for a qualifying rival Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailCarnageAtTheColosseum],
        eddies: 6,
      },
      { gigArea: [{ dieType: "d8", faceValue: 8 }] },
    );
    const cardId = engine.findCardId(welcomeToNightCityRetailCarnageAtTheColosseum, "hand", P1);

    expect(computeEffectiveCost(engine.getState(), cardId, P1)).toBe(6);
    engine.playCard(welcomeToNightCityRetailCarnageAtTheColosseum, { as: P1 });
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("never reduces its play cost below 1 €$", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailCarnageAtTheColosseum],
        eddies: 1,
        gigArea: [
          { dieType: "d20", faceValue: 8 },
          { dieType: "d12", faceValue: 8 },
          { dieType: "d10", faceValue: 8 },
          { dieType: "d8", faceValue: 8 },
          { dieType: "d20", faceValue: 8, source: "rival" },
          { dieType: "d12", faceValue: 8, source: "rival" },
        ],
        fixerDice: [],
      },
      { fixerDice: [] },
    );
    const cardId = engine.findCardId(welcomeToNightCityRetailCarnageAtTheColosseum, "hand", P1);

    expect(computeEffectiveCost(engine.getState(), cardId, P1)).toBe(1);
    engine.playCard(welcomeToNightCityRetailCarnageAtTheColosseum, { as: P1 });
    expect(engine.getEddies(P1)).toBe(0);
  });
});
