import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailNocturneOp55N1,
  welcomeToNightCityRetailRogueAmendiaresPreemSolo,
} from "@tcg/cyberpunk-cards";
import { getEffectiveRules } from "../../../active-effects/index.ts";
import { computeEffectiveCost } from "../../../moves/compute-effective-cost.ts";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectAttackCandidate,
  expectNotAttackCandidate,
} from "../../../testing/index.ts";

const nocturne = welcomeToNightCityRetailNocturneOp55N1;

describe("Nocturne OP55 N1", () => {
  it("is the exact blue 3-cost Arasaka Plan Program with three play modes", () => {
    expect(nocturne).toMatchObject({
      canonicalId: "nocturne-op55-n1",
      slug: "nocturne-op55-n1",
      name: "Nocturne OP55 N1",
      displayName: "Nocturne OP55 N1",
      type: "program",
      color: "blue",
      classifications: ["Arasaka", "Plan"],
      cost: 3,
      ram: 2,
      hasSellTag: true,
      printNumber: "134",
      rulesText:
        "If your fixer area is empty, play this Program for 1 €$. Choose one effect.\nDraw 2. // A Unit can't attack until your next turn. // A friendly Legend may use {Go Solo} for -2 €$ this turn, to a minimum of 1 €$.",
      costModifier: {
        reducer: "replace",
        amount: 1,
        conditions: [
          {
            condition: "fixerAreaCount",
            controller: "friendly",
            comparison: "eq",
            value: 0,
          },
        ],
      },
      abilities: [
        {
          kind: "triggered",
          trigger: { trigger: "play" },
          source: { selector: "self" },
          effects: [
            {
              effect: "chooseEffect",
              options: [
                {
                  id: "draw",
                  effects: [{ effect: "draw", player: "friendly", amount: 2 }],
                },
                {
                  id: "cant-attack",
                  effects: [
                    {
                      effect: "grantRule",
                      target: {
                        selector: "card",
                        zones: ["field"],
                        cardTypes: ["unit"],
                        selection: { mode: "choose", min: 1, max: 1 },
                      },
                      rule: "cantAttack",
                      duration: "untilSourceNextTurn",
                    },
                  ],
                },
                {
                  id: "go-solo",
                  effects: [
                    {
                      effect: "grantCostModifier",
                      player: "friendly",
                      appliesTo: {
                        selector: "card",
                        controller: "friendly",
                        zones: ["legendArea"],
                        cardTypes: ["legend"],
                        keywords: ["goSolo"],
                      },
                      modifier: { reducer: "flat", amount: 2, min: 1 },
                      duration: "turn",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it("replaces its play cost with 1 €$ when the fixer area is empty", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [nocturne],
        eddies: 1,
        fixerDice: [],
        deck: [welcomeToNightCityRetailFieldOperator, welcomeToNightCityRetailFieldOperator],
      },
      { fixerDice: ["d4", "d6", "d8", "d10", "d12", "d20"] },
    );
    const id = engine.findCardId(nocturne, "hand", P1);
    expect(computeEffectiveCost(engine.getState(), id, P1)).toBe(1);

    engine.playCard(nocturne, { as: P1 });
    engine.resolveChooseEffect("draw", { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getHandCount(P1)).toBe(2);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      nocturne.id,
    );
  });

  it("keeps its printed 3 €$ cost while the fixer still has dice", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [nocturne],
      legendArea: [],
      eddies: 1,
      fixerDice: ["d4", "d6", "d8", "d10", "d12", "d20"],
    });
    const id = engine.findCardId(nocturne, "hand", P1);
    expect(computeEffectiveCost(engine.getState(), id, P1)).toBe(3);
    const failure = engine.expectFailure(() => engine.playCard(nocturne, { as: P1 }));
    expect(failure.errorCode).toBe("INSUFFICIENT_EDDIES");
  });

  it("can choose either player's Unit and prevents that Unit attacking until the caster's next turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [nocturne],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        eddies: 1,
        fixerDice: [],
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        fixerDice: ["d4", "d6", "d8", "d10", "d12", "d20"],
      },
    );

    engine.playCard(nocturne, { as: P1 });
    engine.resolveChooseEffect("cant-attack", { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice).toMatchObject({ type: "chooseTarget", payload: { min: 1, max: 1 } });
    if (choice?.type !== "chooseTarget") throw new Error("Expected Unit target choice");
    const rivalUnitId = engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P2);
    expect(choice.payload.eligibleIds).toEqual(
      expect.arrayContaining([
        engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P1),
        rivalUnitId,
      ]),
    );
    engine.resolveEffectTargetIds([rivalUnitId], { as: P1 });

    expect(getEffectiveRules(engine.getState(), rivalUnitId)).toContain("cantAttack");
    engine.completeTurn({ as: P1 });
    expectNotAttackCandidate(engine, welcomeToNightCityRetailFieldOperator, { as: P2 });
    engine.completeTurn({ as: P2 });
    expect(getEffectiveRules(engine.getState(), rivalUnitId)).not.toContain("cantAttack");
    engine.completeTurn({ as: P1 });
    expectAttackCandidate(engine, welcomeToNightCityRetailFieldOperator, { as: P2 });
  });

  it("lets a friendly Legend use Go Solo for 2 less this turn, minimum 1", () => {
    const legend = welcomeToNightCityRetailRogueAmendiaresPreemSolo;
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [nocturne],
        legendArea: [{ card: legend, faceDown: false }],
        eddies: 6,
        fixerDice: [],
      },
      { fixerDice: ["d4", "d6", "d8", "d10", "d12", "d20"] },
    );

    engine.playCard(nocturne, { as: P1 });
    engine.resolveChooseEffect("go-solo", { as: P1 });

    const legendId = engine.findCardId(legend, "legendArea", P1);
    expect(computeEffectiveCost(engine.getState(), legendId, P1)).toBe(5);
    expect(engine.executeMove("goSolo", { args: { cardId: legendId as string } }, P1).success).toBe(
      true,
    );
    // Nocturne plays for 1 €$ (empty fixer area), leaving 5 eddies. The
    // legend then funds 1 €$ of its own discounted Go Solo cost (preferred
    // payment source), so the eddie pool only drains 4.
    expect(engine.getEddies(P1)).toBe(1);
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      legend.id,
    );
  });

  it("reduces only friendly Go Solo Legends and expires at the end of the turn", () => {
    const legend = welcomeToNightCityRetailRogueAmendiaresPreemSolo;
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [nocturne],
        legendArea: [{ card: legend, faceDown: false }],
        eddies: 1,
        fixerDice: [],
      },
      {
        legendArea: [{ card: legend, faceDown: false }],
        fixerDice: ["d4", "d6", "d8", "d10", "d12", "d20"],
      },
    );

    engine.playCard(nocturne, { as: P1 });
    engine.resolveChooseEffect("go-solo", { as: P1 });
    const friendlyLegendId = engine.findCardId(legend, "legendArea", P1);
    const rivalLegendId = engine.findCardId(legend, "legendArea", P2);
    expect(computeEffectiveCost(engine.getState(), friendlyLegendId, P1)).toBe(5);
    expect(computeEffectiveCost(engine.getState(), rivalLegendId, P2)).toBe(7);

    engine.completeTurn({ as: P1 });
    expect(computeEffectiveCost(engine.getState(), friendlyLegendId, P1)).toBe(7);
  });

  it("never reduces a friendly Go Solo Legend below the printed minimum of 1", () => {
    const legend = welcomeToNightCityRetailRogueAmendiaresPreemSolo;
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [nocturne, nocturne, nocturne],
      legendArea: [{ card: legend, faceDown: false }],
      eddies: 3,
      fixerDice: [],
    });

    for (let count = 0; count < 3; count += 1) {
      engine.playCard(nocturne, { as: P1 });
      engine.resolveChooseEffect("go-solo", { as: P1 });
    }

    const legendId = engine.findCardId(legend, "legendArea", P1);
    expect(computeEffectiveCost(engine.getState(), legendId, P1)).toBe(1);
  });

  it("keeps all three printed modes available even when no nested target currently exists", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [nocturne],
      eddies: 1,
      fixerDice: [],
    });

    engine.playCard(nocturne, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice).toMatchObject({ type: "chooseEffect" });
    if (choice?.type !== "chooseEffect") throw new Error("Expected effect choice");
    expect(choice.payload.options.map((option) => option.id)).toEqual([
      "draw",
      "cant-attack",
      "go-solo",
    ]);
  });
});
