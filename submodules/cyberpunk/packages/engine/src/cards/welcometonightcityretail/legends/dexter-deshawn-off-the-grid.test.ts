import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDexterDeshawnOffTheGrid,
  welcomeToNightCityRetailFieldOperator,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import {
  CyberpunkTestEngine,
  expectAdjustGigChoice,
  expectEligibleGigs,
  P1,
  P2,
} from "../../../testing/index.ts";

const dexter = welcomeToNightCityRetailDexterDeshawnOffTheGrid;

describe("Dexter DeShawn — Off the Grid", () => {
  it("is the exact red Fixer Legend with its Call modal and Spend Gig increase", () => {
    expect(dexter).toMatchObject({
      canonicalId: "dexter-deshawn-off-the-grid",
      slug: "dexter-deshawn-off-the-grid",
      name: "Dexter DeShawn",
      subname: "Off the Grid",
      displayName: "Dexter DeShawn: Off the Grid",
      type: "legend",
      color: "red",
      classifications: ["Fixer"],
      ram: 2,
      hasSellTag: true,
      printNumber: "002",
      timingTriggers: ["call"],
      rulesText:
        "{Call} Choose one effect.\nGive a friendly Unit +2 power this turn. // Draw 1.\n{Spend}: Increase a Gig by up to 2.",
    });
    expect(dexter.abilities).toMatchObject([
      {
        kind: "triggered",
        trigger: { trigger: "call" },
        source: { selector: "self" },
        effects: [
          {
            effect: "chooseEffect",
            options: [
              {
                id: "buff",
                effects: [
                  {
                    effect: "modifyPower",
                    target: {
                      selector: "card",
                      controller: "friendly",
                      zones: ["field"],
                      cardTypes: ["unit"],
                      selection: { mode: "choose", min: 1, max: 1 },
                    },
                    value: 2,
                    duration: "turn",
                  },
                ],
              },
              {
                id: "draw",
                effects: [{ effect: "draw", player: "friendly", amount: 1 }],
              },
            ],
          },
        ],
      },
      {
        kind: "triggered",
        trigger: { trigger: "activated" },
        source: { selector: "self" },
        bindings: [
          {
            id: "selectedGig",
            target: {
              selector: "gig",
              amount: 1,
              selection: { mode: "choose", min: 1, max: 1 },
            },
          },
        ],
        costs: [{ cost: "spend", target: { selector: "self" } }],
        effects: [
          {
            effect: "adjustGig",
            target: { selector: "bound", id: "selectedGig" },
            maxAmount: 2,
            direction: "increase",
            chooseUpTo: true,
          },
        ],
      },
    ]);
  });

  it("on Call lets you give a friendly Unit +2 power this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: dexter, faceDown: true }],
      field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
      eddies: 2,
    });

    engine.callLegend(dexter, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseEffect");
    engine.resolveChooseEffect("buff", { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });

    const unit = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1);
    expect(getEffectivePower(engine.getState(), unit.instanceId as string)).toBe(
      (welcomeToNightCityRetailFieldOperator.power ?? 0) + 2,
    );
    expect(engine.getEddies(P1)).toBe(1);
    engine.completeTurn({ as: P1 });
    expect(getEffectivePower(engine.getState(), unit.instanceId as string)).toBe(
      welcomeToNightCityRetailFieldOperator.power ?? 0,
    );
  });

  it("on Call lets you draw 1 instead", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: dexter, faceDown: true }],
      deck: [welcomeToNightCityRetailCorpoSecurity],
      eddies: 2,
    });
    const handBefore = engine.getHandCount(P1);

    engine.callLegend(dexter, { as: P1 });
    engine.resolveChooseEffect("draw", { as: P1 });

    expect(engine.getHandCount(P1)).toBe(handBefore + 1);
  });

  it("spends to increase any player's Gig by up to 2", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: dexter, faceDown: false, spent: false }],
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
      { gigArea: [{ dieType: "d8", faceValue: 2 }] },
    );

    engine.activateAbility(dexter, 1, { as: P1 });
    expectEligibleGigs(engine, [
      { dieType: "d6", as: P1 },
      { dieType: "d8", as: P2 },
    ]);
    const gigId = engine.findGigIdByType(P2, "d8");
    engine.resolveEffectTargetIds([gigId], {
      as: P1,
      allowPendingChoice: true,
      reason: "Dexter still needs the Gig increase amount",
    });
    expectAdjustGigChoice(engine, { direction: "increase", maxAmount: 2 });
    const excessive = engine.expectFailure(() => engine.resolveAdjustGig(5, { as: P1 }));
    expect(excessive.errorCode).toBe("EXCEEDS_MAX_AMOUNT");
    const decrease = engine.expectFailure(() => engine.resolveAdjustGig(1, { as: P1 }));
    expect(decrease.errorCode).toBe("WRONG_DIRECTION");
    engine.resolveAdjustGig(4, { as: P1 });
    expect(engine.getCard(dexter, "legendArea", P1).meta.spent).toBe(true);
    expect(engine.getGigDice(P2).find((die) => die.dieType === "d8")?.faceValue).toBe(4);
    expect(engine.getGigDice(P1).find((die) => die.dieType === "d6")?.faceValue).toBe(2);
  });

  it("may choose an increase of 0 because the effect says up to 2", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: dexter, faceDown: false, spent: false }],
      gigArea: [{ dieType: "d6", faceValue: 2 }],
    });

    engine.activateAbility(dexter, 1, { as: P1 });
    const gigId = engine.findGigIdByType(P1, "d6");
    engine.resolveEffectTargetIds([gigId], {
      as: P1,
      allowPendingChoice: true,
      reason: "Dexter still needs the optional increase amount",
    });
    expectAdjustGigChoice(engine, { direction: "increase", maxAmount: 2 });
    engine.resolveAdjustGig(2, { as: P1 });

    expect(engine.getGigValue(P1)).toBe(2);
    expect(engine.getCard(dexter, "legendArea", P1).meta.spent).toBe(true);
    engine.expectNoPendingChoice();
  });

  it("cannot spend while already spent", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: dexter, faceDown: false }],
      gigArea: [{ dieType: "d6", faceValue: 2 }],
    });
    engine.judgeSpendCard(dexter, { as: P1 });

    const failure = engine.expectFailure(() => engine.activateAbility(dexter, 1, { as: P1 }));
    expect(failure.errorCode).toBe("CARD_SPENT");
  });

  it("does not buff a rival Unit from the Call power option", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: dexter, faceDown: true }],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
        eddies: 2,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }],
      },
    );

    engine.callLegend(dexter, { as: P1 });
    engine.resolveChooseEffect("buff", { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    if (choice?.type === "chooseTarget") {
      expect(choice.payload.eligibleIds).not.toContain(
        engine.findCardId(welcomeToNightCityRetailCorpoSecurity, "field", P2),
      );
    }
  });
});
