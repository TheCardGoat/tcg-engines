import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckYorinobuArasakaEmbracingDestruction,
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailDyingNightVSPistol,
  welcomeToNightCityRetailFieldOperator,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const yorinobu = embracingPowerRetailStarterDeckYorinobuArasakaEmbracingDestruction;

describe("Yorinobu Arasaka - Embracing Destruction (Embracing Power retail starter)", () => {
  it("has the exact red Arasaka Corpo identity and first-attack draw/discard DSL", () => {
    expect(yorinobu).toMatchObject({
      canonicalId: "yorinobu-arasaka-embracing-destruction",
      slug: "yorinobu-arasaka-embracing-destruction",
      name: "Yorinobu Arasaka",
      subname: "Embracing Destruction",
      displayName: "Yorinobu Arasaka: Embracing Destruction",
      type: "legend",
      color: "red",
      classifications: ["Arasaka", "Corpo"],
      cost: null,
      power: null,
      ram: 2,
      hasSellTag: true,
      rarity: "Epic",
      printNumber: "001",
      rulesText:
        "The first time a friendly ARASAKA Unit attacks each turn, draw 1. Then, if you have less than 20 ☆ (Street Cred), discard 1.",
      abilities: [
        {
          kind: "triggered",
          trigger: {
            trigger: "event",
            event: {
              event: "cardAttacks",
              player: "friendly",
              target: {
                selector: "card",
                controller: "friendly",
                zones: ["field"],
                cardTypes: ["unit"],
                classifications: ["Arasaka"],
              },
            },
          },
          source: { selector: "self" },
          limits: ["firstTimeEachTurn"],
          effects: [
            { effect: "draw", player: "friendly", amount: 1 },
            {
              effect: "discardFromHand",
              player: "friendly",
              amount: 1,
              conditions: [
                {
                  condition: "streetCred",
                  controller: "friendly",
                  comparison: "lt",
                  value: 20,
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it("calls for exactly 1 Eddie and turns face up", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: yorinobu, faceDown: true }],
      eddies: 1,
    });
    engine.spendAllLegends();
    engine.callLegend(yorinobu, { as: P1 });
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCard(yorinobu, "legendArea", P1).meta.faceDown).toBe(false);

    const short = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: yorinobu, faceDown: true }],
      eddies: 0,
    });
    short.spendAllLegends();
    expect(short.expectFailure(() => short.callLegend(yorinobu, { as: P1 })).errorCode).toBe(
      "INSUFFICIENT_EDDIES",
    );
  });

  it("draws for the first friendly Arasaka Unit attack and discards below 20 Street Cred", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailDyingNightVSPistol],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        legendArea: [
          {
            card: embracingPowerRetailStarterDeckYorinobuArasakaEmbracingDestruction,
            faceDown: false,
          },
        ],
        gigArea: [
          { dieType: "d12", faceValue: 12 },
          { dieType: "d8", faceValue: 7 },
        ],
      },
      undefined,
      { preserveDeckOrder: true },
    );

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    engine.resolveDiscardFromHand([welcomeToNightCityRetailDyingNightVSPistol], { as: P1 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailDyingNightVSPistol.id,
    );
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("does not trigger from a non-Arasaka Unit attack", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [{ card: welcomeToNightCityRetailDelamainCab, spent: false, hasLag: false }],
        legendArea: [
          {
            card: embracingPowerRetailStarterDeckYorinobuArasakaEmbracingDestruction,
            faceDown: false,
          },
        ],
        gigArea: [
          { dieType: "d12", faceValue: 12 },
          { dieType: "d8", faceValue: 8 },
        ],
      },
      undefined,
      { preserveDeckOrder: true },
    );

    engine.attackRival(welcomeToNightCityRetailDelamainCab, { as: P1 });

    expect(engine.getHandCount(P1)).toBe(0);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("draws without discarding at 20 or more Street Cred", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        legendArea: [
          {
            card: embracingPowerRetailStarterDeckYorinobuArasakaEmbracingDestruction,
            faceDown: false,
          },
        ],
        gigArea: [
          { dieType: "d12", faceValue: 12 },
          { dieType: "d8", faceValue: 8 },
        ],
      },
      undefined,
      { preserveDeckOrder: true },
    );

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("triggers only for the first friendly Arasaka Unit attack each turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailDelamainCab],
        field: [
          { card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false },
          { card: embracingPowerRetailStarterDeckMinotaur, spent: false, hasLag: false },
        ],
        legendArea: [{ card: yorinobu, faceDown: false }],
        gigArea: [
          { dieType: "d12", faceValue: 12 },
          { dieType: "d8", faceValue: 8 },
        ],
      },
      {
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, spent: true },
          { card: welcomeToNightCityRetailDelamainCab, spent: true },
        ],
      },
      { preserveDeckOrder: true },
    );
    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });
    expect(engine.getHandCount(P1)).toBe(1);
    engine.attackUnit(
      embracingPowerRetailStarterDeckMinotaur,
      welcomeToNightCityRetailDelamainCab,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });
    expect(engine.getHandCount(P1)).toBe(1);
  });

  it("resets the first-attack limit on the controller's next turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailDelamainCab],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        legendArea: [{ card: yorinobu, faceDown: false }],
        gigArea: [
          { dieType: "d12", faceValue: 12 },
          { dieType: "d8", faceValue: 8 },
        ],
      },
      {
        gigArea: [
          { dieType: "d4", faceValue: 2 },
          { dieType: "d6", faceValue: 3 },
        ],
      },
      { preserveDeckOrder: true },
    );

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.resolveAttack({ as: P1 });
    engine.resolveAttack({ as: P2, pass: true });
    engine.resolveAttack({ as: P1, gigIdsToSteal: [engine.getGigDice(P2)[0]!.id] });
    expect(engine.getHandCount(P1)).toBe(1);

    engine.completeTurn({ as: P1 });
    engine.completeTurn({ as: P2 });
    const handCountBeforeSecondTurnAttack = engine.getHandCount(P1);
    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
    expect(engine.getHandCount(P1)).toBe(handCountBeforeSecondTurnAttack + 1);
  });

  it("does not trigger from a rival Arasaka Unit attack", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity],
        legendArea: [{ card: yorinobu, faceDown: false }],
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
      },
      { preserveDeckOrder: true },
    );

    engine.completeTurn({ as: P1 });
    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P2 });

    expect(engine.getHandCount(P1)).toBe(0);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });
});
