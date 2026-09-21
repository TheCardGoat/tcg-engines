import { describe, expect, it } from "vite-plus/test";
import {
  theHeistRetailStarterDeckDexterDeshawnOneLastChance,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const dexter = theHeistRetailStarterDeckDexterDeshawnOneLastChance;

describe("Dexter DeShawn - One Last Chance", () => {
  it("is the exact 3-cost 4-power yellow Fixer Unit with Play, Attack, and Defeated triggers", () => {
    expect(dexter).toMatchObject({
      canonicalId: "dexter-deshawn-one-last-chance",
      slug: "dexter-deshawn-one-last-chance",
      name: "Dexter DeShawn",
      subname: "One Last Chance",
      displayName: "Dexter DeShawn: One Last Chance",
      type: "unit",
      color: "yellow",
      classifications: ["Fixer"],
      cost: 3,
      power: 4,
      ram: 2,
      hasSellTag: false,
      printNumber: "002",
      timingTriggers: ["play", "attack", "defeated"],
      rulesText:
        "{Play} {Attack} Adjust a Gig by up to 1.\n{Defeated} If your ☆ (Street Cred) differs from a Rival's by 10+, draw 2.",
    });
    expect(dexter.abilities).toHaveLength(3);
    expect(dexter.abilities[0]).toMatchObject({
      trigger: { trigger: "play" },
      bindings: [{ target: { selector: "gig", amount: 1, selection: { min: 0, max: 1 } } }],
      effects: [{ effect: "adjustGig", maxAmount: 1, direction: "either", chooseUpTo: true }],
    });
    expect(dexter.abilities[1]).toMatchObject({
      trigger: { trigger: "attack" },
      bindings: [{ target: { selector: "gig", amount: 1, selection: { min: 0, max: 1 } } }],
      effects: [{ effect: "adjustGig", maxAmount: 1, direction: "either", chooseUpTo: true }],
    });
    expect(dexter.abilities[2]).toMatchObject({
      trigger: { trigger: "defeated" },
      effects: [
        {
          effect: "draw",
          player: "friendly",
          amount: 2,
          conditions: [
            {
              condition: "streetCredDifference",
              controller: "friendly",
              comparison: "gte",
              other: "rival",
              value: 10,
            },
          ],
        },
      ],
    });
  });

  it("decreases a friendly Gig by 1 on Play", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [theHeistRetailStarterDeckDexterDeshawnOneLastChance],
      eddies: 3,
      gigArea: [{ dieType: "d6", faceValue: 2 }],
    });

    engine.playCard(theHeistRetailStarterDeckDexterDeshawnOneLastChance, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice).toMatchObject({
      type: "chooseTarget",
      payload: { type: "effectTarget", adjustGig: { maxAmount: 1, effectIndex: 0 } },
    });
    const partialTarget = engine.executeMove(
      "resolveEffectTarget",
      { args: { targetIds: [engine.findGigIdByType(P1, "d6")] } },
      P1,
    );
    expect(partialTarget).toMatchObject({
      success: false,
      errorCode: "ATOMIC_ADJUST_GIG_REQUIRED",
    });
    engine.resolveAdjustGig(engine.findGigIdByType(P1, "d6"), 1, { as: P1 });

    expect(engine.getGigDice(P1).find((die) => die.dieType === "d6")?.faceValue).toBe(1);
    expect(engine.getCard(dexter, "field", P1).meta.hasLag).toBe(true);
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("may choose no Gig for the up-to-one Play adjustment", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [dexter],
      eddies: 3,
      gigArea: [{ dieType: "d6", faceValue: 2 }],
    });

    engine.playCard(dexter, { as: P1 });
    engine.declineAdjustGig({ as: P1 });

    expect(engine.getGigValue(P1)).toBe(2);
    engine.expectNoPendingChoice();
  });

  it("adjusts a rival Gig when attacking", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: theHeistRetailStarterDeckDexterDeshawnOneLastChance,
            spent: false,
            hasLag: false,
          },
        ],
      },
      {
        gigArea: [{ dieType: "d8", faceValue: 4 }],
      },
    );

    engine.attackRival(theHeistRetailStarterDeckDexterDeshawnOneLastChance, { as: P1 });
    engine.resolveAdjustGig(engine.findGigIdByType(P2, "d8"), 5, { as: P1 });

    expect(engine.getGigDice(P2).find((die) => die.dieType === "d8")?.faceValue).toBe(5);
  });

  it("draws 2 when defeated with a 10+ Street Cred difference", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailFieldOperator, welcomeToNightCityRetailCorpoSecurity],
        field: [
          {
            card: theHeistRetailStarterDeckDexterDeshawnOneLastChance,
            spent: false,
            hasLag: false,
          },
        ],
        gigArea: [
          { dieType: "d6", faceValue: 6 },
          { dieType: "d8", faceValue: 5 },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, powerModifier: 4 }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      { preserveDeckOrder: true },
    );

    engine.attackUnit(
      theHeistRetailStarterDeckDexterDeshawnOneLastChance,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );
    engine.declineAdjustGig({ as: P1 });
    engine.resolveFullFight({ as: P1 });

    expect(engine.getCardsInZone("hand", P1)).toHaveLength(2);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      theHeistRetailStarterDeckDexterDeshawnOneLastChance.id,
    );
  });

  it("draws 2 when the rival has 10 more Street Cred", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailFieldOperator, welcomeToNightCityRetailCorpoSecurity],
        field: [{ card: dexter, spent: false, hasLag: false }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, powerModifier: 4 }],
        gigArea: [
          { dieType: "d6", faceValue: 6 },
          { dieType: "d8", faceValue: 5 },
        ],
      },
      { preserveDeckOrder: true },
    );

    engine.attackUnit(dexter, welcomeToNightCityRetailCorpoSecurity, { as: P1 });
    engine.declineAdjustGig({ as: P1 });
    engine.resolveFullFight({ as: P1 });

    expect(engine.getHandCount(P1)).toBe(2);
  });

  it("does not draw when the Street Cred difference is only 9", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailFieldOperator, welcomeToNightCityRetailCorpoSecurity],
        field: [{ card: dexter, spent: false, hasLag: false }],
        gigArea: [
          { dieType: "d6", faceValue: 5 },
          { dieType: "d8", faceValue: 5 },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, powerModifier: 4 }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      { preserveDeckOrder: true },
    );

    engine.attackUnit(dexter, welcomeToNightCityRetailCorpoSecurity, { as: P1 });
    engine.declineAdjustGig({ as: P1 });
    engine.resolveFullFight({ as: P1 });

    expect(engine.getHandCount(P1)).toBe(0);
    expect(engine.getCardsInZone("deck", P1).map((card) => card.definitionId)).toEqual(
      expect.arrayContaining([
        welcomeToNightCityRetailFieldOperator.id,
        welcomeToNightCityRetailCorpoSecurity.id,
      ]),
    );
  });
});
