import { describe, expect, it } from "vite-plus/test";
import {
  theHeistRetailStarterDeckDexterDeshawnOneLastChance,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailLiveWithTheAftermath,
  welcomeToNightCityRetailMaxtacSquadron,
  welcomeToNightCityRetailMoxInciters,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const aftermath = welcomeToNightCityRetailLiveWithTheAftermath;

function getTargetChoice(engine: CyberpunkTestEngine, chooser: string) {
  const choice = engine.getState().G.turnMetadata.pendingChoice;
  expect(choice?.type).toBe("chooseTarget");
  if (!choice || choice.type !== "chooseTarget") {
    throw new Error("Expected a choose-target pending choice.");
  }
  expect(choice.chooserId).toBe(chooser);
  expect(choice.payload.type).toBe("effectTarget");

  return choice;
}

describe("Live with the Aftermath", () => {
  it("is the exact yellow 3-cost Plan Program with two mandatory player bindings", () => {
    expect(aftermath).toMatchObject({
      type: "program",
      color: "yellow",
      classifications: ["Plan"],
      printNumber: "068",
      cost: 3,
      power: null,
      ram: 3,
      hasSellTag: true,
      timingTriggers: ["play"],
      abilities: [
        expect.objectContaining({
          trigger: { trigger: "play" },
          bindings: [
            expect.objectContaining({
              id: "friendlyUnit",
              target: expect.objectContaining({
                controller: "friendly",
                selection: { mode: "choose", min: 1, max: 1 },
              }),
            }),
            expect.objectContaining({
              id: "rivalUnit",
              target: expect.objectContaining({
                controller: "rival",
                selection: { mode: "choose", min: 1, max: 1, chooser: "rival" },
              }),
            }),
          ],
        }),
      ],
    });
  });

  it("makes its controller choose one friendly Unit first", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [aftermath], eddies: 3, field: [welcomeToNightCityRetailMoxInciters] },
      { field: [welcomeToNightCityRetailCorpoSecurity] },
    );

    engine.playCard(aftermath, { as: P1 });

    const choice = getTargetChoice(engine, P1);
    expect(choice.payload.eligibleIds).toEqual([
      engine.getCard(welcomeToNightCityRetailMoxInciters, "field", P1).instanceId,
    ]);
  });

  it("rejects its controller selecting the rival's Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [aftermath], eddies: 3, field: [welcomeToNightCityRetailMoxInciters] },
      { field: [welcomeToNightCityRetailCorpoSecurity] },
    );
    const friendlyUnit = engine.getCard(welcomeToNightCityRetailMoxInciters, "field", P1);
    const rivalUnit = engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2);

    engine.playCard(aftermath, { as: P1 });

    expect(
      engine.executeMove(
        "resolveEffectTarget",
        { args: { targetIds: [rivalUnit.instanceId] } },
        P1,
      ),
    ).toMatchObject({
      success: false,
      errorCode: "INVALID_CHOICE",
    });

    const choice = getTargetChoice(engine, P1);
    expect(choice.payload.eligibleIds).toEqual([friendlyUnit.instanceId]);
    expect(engine.getCardsInZone("field", P1)).toContainEqual(friendlyUnit);
    expect(engine.getCardsInZone("field", P2)).toContainEqual(rivalUnit);
  });

  it("then makes the rival choose one of their own Units", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [aftermath], eddies: 3, field: [welcomeToNightCityRetailMoxInciters] },
      {
        field: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailSwordwiseHuscle],
      },
    );

    engine.playCard(aftermath, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailMoxInciters, {
      as: P1,
      allowPendingChoice: true,
      reason: "the rival must now choose their own Unit",
    });

    const choice = getTargetChoice(engine, P2);
    expect(choice.payload.eligibleIds).toEqual(
      expect.arrayContaining([
        engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2).instanceId,
        engine.getCard(welcomeToNightCityRetailSwordwiseHuscle, "field", P2).instanceId,
      ]),
    );
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMoxInciters.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailMoxInciters.id,
    );
  });

  it("defeats the Unit selected by each player and trashes the Program", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [aftermath], eddies: 3, field: [welcomeToNightCityRetailMoxInciters] },
      { field: [welcomeToNightCityRetailCorpoSecurity] },
    );

    engine.playCard(aftermath, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailMoxInciters, {
      as: P1,
      allowPendingChoice: true,
      reason: "the rival must now choose their own Unit",
    });
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P2 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toEqual(
      expect.arrayContaining([aftermath.id, welcomeToNightCityRetailMoxInciters.id]),
    );
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("still defeats the controller's Unit when the rival controls no Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [aftermath], eddies: 3, field: [welcomeToNightCityRetailMoxInciters] },
      { field: [] },
    );

    engine.playCard(aftermath, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailMoxInciters, { as: P1 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toEqual(
      expect.arrayContaining([aftermath.id, welcomeToNightCityRetailMoxInciters.id]),
    );
    engine.expectNoPendingChoice();
  });

  it("still lets the rival defeat their Unit when the controller controls no Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [aftermath], eddies: 3, field: [] },
      { field: [welcomeToNightCityRetailCorpoSecurity] },
    );

    engine.playCard(aftermath, { as: P1 });
    const choice = getTargetChoice(engine, P2);
    expect(choice.payload.eligibleIds).toEqual([
      engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2).instanceId,
    ]);
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P2 });

    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      aftermath.id,
    );
    engine.expectNoPendingChoice();
  });

  it("pays and trashes itself without a choice when neither player controls a Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [aftermath], eddies: 3, field: [] },
      { field: [] },
    );

    engine.playCard(aftermath, { as: P1 });

    expect(engine.getState().G.players[P1]?.eddies).toBe(0);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      aftermath.id,
    );
    engine.expectNoPendingChoice();
  });
});

describe("Live with the Aftermath + Dexter DeShawn: One Last Chance", () => {
  it("lets Dexter's {Defeated} draw 2 when the Street Cred difference is 10+", () => {
    // CR 11.2.1 — Street Cred is the sum of Gig dice. P1 has 11 (6 + 5), P2 has
    // 1, so the difference is exactly 10 and the {Defeated} condition is met.
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [aftermath],
        eddies: 3,
        field: [theHeistRetailStarterDeckDexterDeshawnOneLastChance],
        deck: [welcomeToNightCityRetailFieldOperator, welcomeToNightCityRetailCorpoSecurity],
        gigArea: [
          { dieType: "d6", faceValue: 6 },
          { dieType: "d8", faceValue: 5 },
        ],
      },
      {
        field: [welcomeToNightCityRetailMaxtacSquadron],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      { preserveDeckOrder: true },
    );
    expect(engine.getStreetCred(P1)).toBe(11);
    expect(engine.getStreetCred(P2)).toBe(1);

    engine.playCard(aftermath, { as: P1 });
    engine.resolveEffectTarget(theHeistRetailStarterDeckDexterDeshawnOneLastChance, {
      as: P1,
      allowPendingChoice: true,
      reason: "the rival must now choose their own Unit",
    });
    engine.resolveEffectTarget(welcomeToNightCityRetailMaxtacSquadron, { as: P2 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toEqual(
      expect.arrayContaining([
        aftermath.id,
        theHeistRetailStarterDeckDexterDeshawnOneLastChance.id,
      ]),
    );
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailFieldOperator.id,
      welcomeToNightCityRetailCorpoSecurity.id,
    ]);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("does not draw when the Street Cred difference is under 10", () => {
    // P1 has 10, P2 has 1 — the difference is 9, so Dexter's {Defeated}
    // condition fails and the hand stays empty after the Program resolves.
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [aftermath],
        eddies: 3,
        field: [theHeistRetailStarterDeckDexterDeshawnOneLastChance],
        deck: [welcomeToNightCityRetailFieldOperator, welcomeToNightCityRetailCorpoSecurity],
        gigArea: [{ dieType: "d10", faceValue: 10 }],
      },
      {
        field: [welcomeToNightCityRetailMaxtacSquadron],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      { preserveDeckOrder: true },
    );
    expect(engine.getStreetCred(P1)).toBe(10);
    expect(engine.getStreetCred(P2)).toBe(1);

    engine.playCard(aftermath, { as: P1 });
    engine.resolveEffectTarget(theHeistRetailStarterDeckDexterDeshawnOneLastChance, {
      as: P1,
      allowPendingChoice: true,
      reason: "the rival must now choose their own Unit",
    });
    engine.resolveEffectTarget(welcomeToNightCityRetailMaxtacSquadron, { as: P2 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toEqual(
      expect.arrayContaining([
        aftermath.id,
        theHeistRetailStarterDeckDexterDeshawnOneLastChance.id,
      ]),
    );
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(0);
    // The deck fixture stacks the authored cards above the default deck — the
    // top two must be untouched by any draw.
    expect(
      engine
        .getCardsInZone("deck", P1)
        .slice(0, 2)
        .map((card) => card.definitionId),
    ).toEqual([welcomeToNightCityRetailFieldOperator.id, welcomeToNightCityRetailCorpoSecurity.id]);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });
});
