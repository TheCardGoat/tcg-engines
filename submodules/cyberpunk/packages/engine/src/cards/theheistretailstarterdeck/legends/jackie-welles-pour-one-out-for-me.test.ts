import { describe, expect, it } from "vite-plus/test";
import {
  theHeistRetailStarterDeckJackieWellesPourOneOutForMe,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailDyingNightVSPistol,
  welcomeToNightCityRetailFloorIt,
  welcomeToNightCityRetailMoxInciters,
  welcomeToNightCityRetailRidingNomad,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

function expectPendingTargetPayloadType(
  engine: CyberpunkTestEngine,
  payloadType: "adjustGig" | "effectTarget",
): void {
  const choice = engine.getState().G.turnMetadata.pendingChoice;
  expect(choice?.type).toBe("chooseTarget");
  if (!choice || choice.type !== "chooseTarget") {
    throw new Error("Expected a chooseTarget pending choice.");
  }
  expect(choice.payload.type).toBe(payloadType);
}

function selectJackieGig(engine: CyberpunkTestEngine, dieType: "d4" | "d6"): void {
  engine.resolveEffectTargetIds([engine.findGigIdByType(P1, dieType)], {
    as: P1,
    allowPendingChoice: true,
    reason: "Jackie still needs the optional friendly Gig target",
  });
}

describe("Jackie Welles - Pour One Out For Me (The Heist retail starter)", () => {
  it("is the exact blue Merc Legend with a first-blue-Unit-or-Gear optional Gig decrease", () => {
    const jackie = theHeistRetailStarterDeckJackieWellesPourOneOutForMe;
    expect(jackie).toMatchObject({
      canonicalId: "jackie-welles-pour-one-out-for-me",
      slug: "jackie-welles-pour-one-out-for-me",
      name: "Jackie Welles",
      subname: "Pour One Out For Me",
      displayName: "Jackie Welles: Pour One Out For Me",
      type: "legend",
      color: "blue",
      classifications: ["Merc"],
      cost: null,
      power: null,
      ram: 2,
      hasSellTag: true,
      printNumber: "011",
      rarity: "Epic",
      rulesText:
        "The first time you play a Blue Unit or Blue Gear each turn, you may decrease a friendly Gig by up to 2. If it becomes a min Gig, draw 1.",
    });
    expect(jackie.abilities).toEqual([
      expect.objectContaining({
        trigger: {
          trigger: "event",
          event: {
            event: "cardPlayed",
            player: "friendly",
            target: {
              selector: "card",
              controller: "friendly",
              cardTypes: ["unit", "gear"],
              colors: ["blue"],
            },
          },
        },
        source: { selector: "self" },
        limits: ["firstTimeEachTurn"],
        bindings: [
          {
            id: "selectedGig",
            target: {
              selector: "gig",
              controller: "friendly",
              amount: 1,
              selection: { mode: "choose", min: 0, max: 1 },
            },
          },
        ],
        effects: [
          {
            effect: "adjustGig",
            target: { selector: "bound", id: "selectedGig" },
            maxAmount: 2,
            direction: "decrease",
            chooseUpTo: true,
            optional: true,
          },
          {
            effect: "draw",
            player: "friendly",
            amount: 1,
            conditions: [
              {
                condition: "targetBecameValue",
                target: { selector: "bound", id: "selectedGig" },
                property: "gigValue",
                value: "min",
              },
            ],
          },
        ],
      }),
    ]);
  });

  it("decreases a friendly Gig after the first blue Unit play and draws when it becomes min", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailDelamainCab],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        legendArea: [
          { card: theHeistRetailStarterDeckJackieWellesPourOneOutForMe, faceDown: false },
        ],
        gigArea: [{ dieType: "d4", faceValue: 3 }],
        eddies: 4,
      },
      undefined,
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailDelamainCab, { as: P1 });
    selectJackieGig(engine, "d4");
    engine.resolveAdjustGig(1, { as: P1 });

    expect(engine.getGigValue(P1)).toBe(1);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("does not open a target choice when a blue card is played with no friendly Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailDelamainCab],
      deck: [welcomeToNightCityRetailCorpoSecurity],
      legendArea: [{ card: theHeistRetailStarterDeckJackieWellesPourOneOutForMe, faceDown: false }],
      eddies: 4,
    });

    engine.playCard(welcomeToNightCityRetailDelamainCab, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget")
      throw new Error("Expected empty optional Gig choice.");
    expect(choice.payload).toMatchObject({ eligibleIds: [], min: 0, max: 1, canDecline: true });
    engine.declineAdjustGig({ as: P1 });
    engine.expectNoPendingChoice();
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("may decline before choosing among multiple friendly Gigs", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailDelamainCab],
      deck: [welcomeToNightCityRetailCorpoSecurity],
      legendArea: [{ card: theHeistRetailStarterDeckJackieWellesPourOneOutForMe, faceDown: false }],
      gigArea: [
        { dieType: "d4", faceValue: 3 },
        { dieType: "d6", faceValue: 4 },
      ],
      eddies: 4,
    });

    engine.playCard(welcomeToNightCityRetailDelamainCab, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected optional Gig choice.");
    expect(choice.payload).toMatchObject({ min: 0, max: 1, canDecline: true });
    engine.declineAdjustGig({ as: P1 });

    expect(engine.getGigDice(P1).map((die) => die.faceValue)).toEqual([3, 4]);
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(0);
  });

  it("triggers for the first Blue Gear and draws only when the chosen Gig reaches min", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailDyingNightVSPistol],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        legendArea: [
          { card: theHeistRetailStarterDeckJackieWellesPourOneOutForMe, faceDown: false },
        ],
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false, hasLag: false }],
        gigArea: [{ dieType: "d4", faceValue: 3 }],
        eddies: 2,
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.attachGear(
      welcomeToNightCityRetailDyingNightVSPistol,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );
    selectJackieGig(engine, "d4");
    engine.resolveAdjustGig(1, { as: P1 });

    expect(engine.getGigValue(P1)).toBe(1);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("does not draw when the decrease stops above min", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailDelamainCab],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        legendArea: [
          { card: theHeistRetailStarterDeckJackieWellesPourOneOutForMe, faceDown: false },
        ],
        gigArea: [{ dieType: "d6", faceValue: 4 }],
        eddies: 4,
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailDelamainCab, { as: P1 });
    selectJackieGig(engine, "d6");
    engine.resolveAdjustGig(2, { as: P1 });

    expect(engine.getGigValue(P1)).toBe(2);
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(0);
  });

  it("does not draw when a Gig was already min and the player chooses zero decrease", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailDelamainCab],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        legendArea: [
          { card: theHeistRetailStarterDeckJackieWellesPourOneOutForMe, faceDown: false },
        ],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
        eddies: 4,
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailDelamainCab, { as: P1 });
    selectJackieGig(engine, "d4");
    engine.resolveAdjustGig(1, { as: P1 });

    expect(engine.getGigValue(P1)).toBe(1);
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(0);
  });

  it("does not trigger again when a blue Program is played after the first blue Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailDelamainCab, welcomeToNightCityRetailFloorIt],
        deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailMoxInciters],
        legendArea: [
          { card: theHeistRetailStarterDeckJackieWellesPourOneOutForMe, faceDown: false },
        ],
        gigArea: [{ dieType: "d4", faceValue: 3 }],
        eddies: 5,
      },
      {
        field: [{ card: welcomeToNightCityRetailRidingNomad, hasLag: false }],
      },
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailDelamainCab, { as: P1 });
    selectJackieGig(engine, "d4");
    engine.resolveAdjustGig(1, { as: P1 });
    expect(engine.getGigValue(P1)).toBe(1);

    engine.playCard(welcomeToNightCityRetailFloorIt, { as: P1 });
    expectPendingTargetPayloadType(engine, "effectTarget");
    engine.resolveEffectTarget(welcomeToNightCityRetailRidingNomad, { as: P1 });

    engine.expectNoPendingChoice();
    expect(engine.getGigValue(P1)).toBe(1);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFloorIt.id,
    );
  });

  it("does not trigger for a second qualifying Blue card in the same turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailDelamainCab, welcomeToNightCityRetailDyingNightVSPistol],
      legendArea: [{ card: theHeistRetailStarterDeckJackieWellesPourOneOutForMe, faceDown: false }],
      field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false, hasLag: false }],
      gigArea: [{ dieType: "d4", faceValue: 3 }],
      eddies: 6,
    });

    engine.playCard(welcomeToNightCityRetailDelamainCab, { as: P1 });
    selectJackieGig(engine, "d4");
    engine.resolveAdjustGig(2, { as: P1 });

    engine.attachGear(
      welcomeToNightCityRetailDyingNightVSPistol,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );

    engine.expectNoPendingChoice();
    expect(engine.getGigValue(P1)).toBe(2);
  });

  it("still triggers on the first blue Unit when a blue Program was played first", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailFloorIt, welcomeToNightCityRetailDelamainCab],
        deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailMoxInciters],
        legendArea: [
          { card: theHeistRetailStarterDeckJackieWellesPourOneOutForMe, faceDown: false },
        ],
        gigArea: [{ dieType: "d4", faceValue: 3 }],
        eddies: 5,
      },
      {
        field: [{ card: welcomeToNightCityRetailRidingNomad, hasLag: false }],
      },
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailFloorIt, { as: P1 });
    expectPendingTargetPayloadType(engine, "effectTarget");
    engine.resolveEffectTarget(welcomeToNightCityRetailRidingNomad, { as: P1 });
    expect(engine.getGigValue(P1)).toBe(3);

    engine.playCard(welcomeToNightCityRetailDelamainCab, { as: P1 });
    expectPendingTargetPayloadType(engine, "effectTarget");
    selectJackieGig(engine, "d4");
    engine.resolveAdjustGig(1, { as: P1 });

    engine.expectNoPendingChoice();
    expect(engine.getGigValue(P1)).toBe(1);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMoxInciters.id,
    );
  });
});
