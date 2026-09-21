import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
  welcomeToNightCityRetailPanamPalmerStrengthThroughFamily,
  welcomeToNightCityRetailVStreetkid,
} from "@tcg/cyberpunk-cards";
import { playerHasCallLegendFree } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const panam = welcomeToNightCityRetailPanamPalmerStrengthThroughFamily;

describe("Panam Palmer — Strength Through Family", () => {
  it("has the exact printed identity and both executable abilities", () => {
    expect(panam).toMatchObject({
      canonicalId: "panam-palmer-strength-through-family",
      slug: "panam-palmer-strength-through-family",
      name: "Panam Palmer",
      subname: "Strength Through Family",
      displayName: "Panam Palmer: Strength Through Family",
      type: "unit",
      color: "green",
      classifications: ["Aldecado", "Merc", "Nomad"],
      cost: 6,
      power: 6,
      ram: 4,
      hasSellTag: false,
      timingTriggers: ["attack"],
      printNumber: "085",
      rarity: "Secret",
      rulesText:
        "During your turn, you may Call a Legend for free.\n{Attack} Discard 1. If you do, draw 1 for each friendly face-up Legend.",
    });
    expect(panam.abilities).toMatchObject([
      {
        kind: "static",
        effects: [
          {
            effect: "grantRule",
            target: { selector: "self" },
            rule: "callLegendFree",
            duration: "continuous",
            conditions: [{ condition: "turn", player: "friendly" }],
          },
        ],
      },
      {
        kind: "triggered",
        trigger: { trigger: "attack" },
        source: { selector: "self" },
        effects: [
          {
            effect: "ifYouDo",
            doEffect: {
              effect: "discardFromHand",
              player: "friendly",
              amount: 1,
              optional: true,
            },
            ifEffects: [
              {
                effect: "draw",
                player: "friendly",
                amount: {
                  type: "perCount",
                  multiplier: 1,
                  target: {
                    selector: "card",
                    controller: "friendly",
                    zones: ["field", "legendArea"],
                    cardTypes: ["legend"],
                    face: "faceUp",
                  },
                },
              },
            ],
          },
        ],
      },
    ]);
  });

  it("lets you Call a Legend for free during your turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: panam, spent: false, hasLag: false }],
      legendArea: [
        { card: welcomeToNightCityRetailVStreetkid, faceDown: true },
        { card: welcomeToNightCityRetailVStreetkid, faceDown: true },
      ],
      eddies: 0,
    });

    expect(playerHasCallLegendFree(engine.getState(), P1)).toBe(true);
    const legendId = engine.findCardId(welcomeToNightCityRetailVStreetkid, "legendArea", P1);
    expect(
      engine.executeMove("callLegend", { args: { legendId: legendId as string } }, P1).success,
    ).toBe(true);
    expect(engine.getCard(welcomeToNightCityRetailVStreetkid, "legendArea", P1).meta.faceDown).toBe(
      false,
    );
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("charges the normal Call cost during the Rival's turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: panam, spent: false, hasLag: false }],
        legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: true }],
        eddies: 1,
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
      },
    );
    engine.judgeSpendCard(welcomeToNightCityRetailVStreetkid, { as: P1 });
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P2 });
    engine.resolveAttack({ as: P2 });

    expect(playerHasCallLegendFree(engine.getState(), P1)).toBe(false);
    engine.callLegend(welcomeToNightCityRetailVStreetkid, { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
  });

  it("stops granting the free Call after Panam leaves the field", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: panam, spent: false, hasLag: false }],
      legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: true }],
      eddies: 0,
    });
    engine.judgeSpendCard(welcomeToNightCityRetailVStreetkid, { as: P1 });
    engine.judgeMoveCardToZone(panam, "trash", { as: P1 });

    expect(playerHasCallLegendFree(engine.getState(), P1)).toBe(false);
    const legendId = engine.findCardId(welcomeToNightCityRetailVStreetkid, "legendArea", P1);
    const failure = engine.executeMove(
      "callLegend",
      { args: { legendId: legendId as string } },
      P1,
    );

    expect(failure).toMatchObject({ success: false, errorCode: "INSUFFICIENT_EDDIES" });
  });

  it("on Attack discards exactly 1 then draws for friendly face-up Legends in both valid areas", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: panam, spent: false, hasLag: false },
          { card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false },
          {
            card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
            spent: false,
            faceDown: false,
          },
        ],
        hand: [welcomeToNightCityRetailCorpoSecurity],
        deck: [
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
        ],
        legendArea: [
          { card: welcomeToNightCityRetailVStreetkid, faceDown: false },
          { card: welcomeToNightCityRetailVStreetkid, faceDown: true },
        ],
      },
      {
        legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: false }],
      },
      { preserveDeckOrder: true },
    );

    engine.attackRival(panam, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice).toMatchObject({
      type: "chooseTarget",
      chooserId: P1,
      payload: {
        type: "discardFromHand",
        amount: 1,
        canDecline: true,
      },
    });
    engine.resolveDiscardFromHand([welcomeToNightCityRetailCorpoSecurity], { as: P1 });

    expect(engine.getHandCount(P1)).toBe(2);
    expect(engine.getCardsInZone("trash", P1)).toHaveLength(1);
  });

  it("does not draw on Attack if you decline the discard", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: panam, spent: false, hasLag: false }],
      hand: [welcomeToNightCityRetailCorpoSecurity],
      deck: [welcomeToNightCityRetailCorpoSecurity],
      legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: false }],
    });
    const handBefore = engine.getHandCount(P1);
    engine.attackRival(panam, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (choice?.type === "chooseTarget") {
      engine.executeMove("resolveDiscardFromHand", { args: { pass: true } }, P1);
    }
    expect(engine.getHandCount(P1)).toBe(handBefore);
  });

  it("does not draw when there is no card available to discard", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: panam, spent: false, hasLag: false }],
      hand: [],
      deck: [welcomeToNightCityRetailCorpoSecurity],
      legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: false }],
    });

    engine.attackRival(panam, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getHandCount(P1)).toBe(0);
  });
});
