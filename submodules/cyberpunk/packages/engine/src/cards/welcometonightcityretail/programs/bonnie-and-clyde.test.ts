import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailBonnieAndClyde,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailPsychoSquad,
  welcomeToNightCityRetailRidingNomad,
  welcomeToNightCityRetailWraithMarauders,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe('Bonnie and Clyde — "Defeat a rival Unit with power 4 or less. You may defeat 2 instead if a Rival controls at least 2 Gigs more than you."', () => {
  it("defeats a single rival Unit with power ≤ 4 when the gig-differential condition is not met", () => {
    // P1 has 1 gig, P2 has 1 gig → differential is 0 (< 2), so only 1 target.
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailBonnieAndClyde],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
        eddies: 5,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, hasLag: false }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    engine.playCard(welcomeToNightCityRetailBonnieAndClyde, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    const payload = (choice as { payload?: { eligibleIds?: string[] } }).payload;
    expect(payload?.eligibleIds).toHaveLength(1);

    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    const trash = engine.getCardsInZone("trash", P2).map((c) => c.definitionId);
    expect(trash).toContain(welcomeToNightCityRetailCorpoSecurity.id);
  });

  it("does not allow defeating 2 targets when the gig-differential condition is not met", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailBonnieAndClyde],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
        eddies: 5,
      },
      {
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, hasLag: false },
          { card: welcomeToNightCityRetailFieldOperator, hasLag: false },
        ],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    engine.playCard(welcomeToNightCityRetailBonnieAndClyde, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    const payload = (choice as { payload?: { max?: number; eligibleIds?: string[] } }).payload;
    // Even though 2 eligible targets exist, max must be 1 when the condition
    // is not met (rival does not control ≥ 2 more gigs).
    expect(payload?.max).toBe(1);
    expect(payload?.eligibleIds).toHaveLength(2);
  });

  it("allows up to 2 targets when a Rival controls at least 2 Gigs more", () => {
    // P1 has 0 gigs, P2 has 2 gigs → differential is 2 (≥ 2), so up to 2.
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailBonnieAndClyde],
        gigArea: [],
        eddies: 5,
      },
      {
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, hasLag: false },
          { card: welcomeToNightCityRetailFieldOperator, hasLag: false },
        ],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 1 },
        ],
      },
    );

    engine.playCard(welcomeToNightCityRetailBonnieAndClyde, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    const payload = (choice as { payload?: { max?: number; eligibleIds?: string[] } }).payload;
    expect(payload?.max).toBe(2);
    expect(payload?.eligibleIds).toHaveLength(2);
  });

  it("can defeat 2 targets when the gig-differential condition is met", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailBonnieAndClyde],
        gigArea: [],
        eddies: 5,
      },
      {
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, hasLag: false },
          { card: welcomeToNightCityRetailFieldOperator, hasLag: false },
        ],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 1 },
        ],
      },
    );

    engine.playCard(welcomeToNightCityRetailBonnieAndClyde, { as: P1 });
    engine.resolveEffectTargetIds(
      [
        engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2).instanceId,
        engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P2).instanceId,
      ],
      { as: P1 },
    );

    const trash = engine.getCardsInZone("trash", P2).map((c) => c.definitionId);
    expect(trash).toContain(welcomeToNightCityRetailCorpoSecurity.id);
    expect(trash).toContain(welcomeToNightCityRetailFieldOperator.id);
  });

  it("only defeats 1 of the valid targets even when the condition is met (player's choice)", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailBonnieAndClyde],
        gigArea: [],
        eddies: 5,
      },
      {
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, hasLag: false },
          { card: welcomeToNightCityRetailFieldOperator, hasLag: false },
        ],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 1 },
        ],
      },
    );

    engine.playCard(welcomeToNightCityRetailBonnieAndClyde, { as: P1 });
    // Player chooses only 1 of the 2 allowed targets.
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    const trash = engine.getCardsInZone("trash", P2).map((c) => c.definitionId);
    expect(trash).toContain(welcomeToNightCityRetailCorpoSecurity.id);
    expect(trash).not.toContain(welcomeToNightCityRetailFieldOperator.id);
    // The un-targeted unit stays on the field.
    const field = engine.getCardsInZone("field", P2).map((c) => c.definitionId);
    expect(field).toContain(welcomeToNightCityRetailFieldOperator.id);
  });

  it("targets a power-4 Unit at the boundary (inclusive)", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailBonnieAndClyde],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
        eddies: 5,
      },
      {
        field: [{ card: welcomeToNightCityRetailRidingNomad, hasLag: false }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    engine.playCard(welcomeToNightCityRetailBonnieAndClyde, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    const payload = (choice as { payload?: { eligibleIds?: string[] } }).payload;
    expect(payload?.eligibleIds).toHaveLength(1);

    engine.resolveEffectTarget(welcomeToNightCityRetailRidingNomad, { as: P1 });

    const trash = engine.getCardsInZone("trash", P2).map((c) => c.definitionId);
    expect(trash).toContain(welcomeToNightCityRetailRidingNomad.id);
  });

  it("does not target rival Units with power > 4", () => {
    // Psycho Squad has power 6 — should not appear as a valid target.
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailBonnieAndClyde],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
        eddies: 5,
      },
      {
        field: [{ card: welcomeToNightCityRetailPsychoSquad, hasLag: false }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    engine.playCard(welcomeToNightCityRetailBonnieAndClyde, { as: P1 });

    // With no valid targets, the engine doesn't create a pending choice.
    engine.expectNoPendingChoice();
    // Psycho Squad remains on the field.
    const field = engine.getCardsInZone("field", P2).map((c) => c.definitionId);
    expect(field).toContain(welcomeToNightCityRetailPsychoSquad.id);
  });

  it("the played Program ends up in the controller's trash after resolving", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailBonnieAndClyde],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
        eddies: 5,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, hasLag: false }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    engine.playCard(welcomeToNightCityRetailBonnieAndClyde, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    const trash = engine.getCardsInZone("trash", P1).map((c) => c.definitionId);
    expect(trash).toContain(welcomeToNightCityRetailBonnieAndClyde.id);
  });

  it("emits an actionLog entry when it resolves", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailBonnieAndClyde],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
        eddies: 5,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, hasLag: false }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    engine.playCard(welcomeToNightCityRetailBonnieAndClyde, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    const last = engine.getLastActionLog();
    expect(last).toBeDefined();
  });

  it("offers up to 2 targets but allows choosing just 1 when exactly 1 valid target exists while condition is met", () => {
    // Condition met (P2 has 2 more gigs), but only 1 eligible target.
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailBonnieAndClyde],
        gigArea: [],
        eddies: 5,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, hasLag: false }],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 1 },
        ],
      },
    );

    engine.playCard(welcomeToNightCityRetailBonnieAndClyde, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    const payload = (choice as { payload?: { max?: number; eligibleIds?: string[] } }).payload;
    // max is 2 (condition met), but only 1 eligible target exists.
    expect(payload?.max).toBe(2);
    expect(payload?.eligibleIds).toHaveLength(1);

    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    const trash = engine.getCardsInZone("trash", P2).map((c) => c.definitionId);
    expect(trash).toContain(welcomeToNightCityRetailCorpoSecurity.id);
  });

  it("highlights only power ≤ 4 units when multiple units of mixed power are on the field", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailBonnieAndClyde],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
        eddies: 5,
      },
      {
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, hasLag: false }, // power 2
          { card: welcomeToNightCityRetailWraithMarauders, hasLag: false }, // power 4
          { card: welcomeToNightCityRetailPsychoSquad, hasLag: false }, // power 6
        ],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    engine.playCard(welcomeToNightCityRetailBonnieAndClyde, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    const payload = (choice as { payload?: { eligibleIds?: string[] } }).payload;
    // Only the 2 units with power ≤ 4 should be eligible.
    expect(payload?.eligibleIds).toHaveLength(2);
  });
});
