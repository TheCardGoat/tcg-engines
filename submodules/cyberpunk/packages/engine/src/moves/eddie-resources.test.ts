import { describe, expect, it } from "vite-plus/test";
import type { Ability } from "@tcg/cyberpunk-types";
import { CyberpunkTestEngine, P1, createMockLegend, createMockUnit } from "../testing/index.ts";
import {
  abilityCostBindingId,
  availableEddiesAfterAbilityCosts,
  canPayAbilityEddieCosts,
} from "./eddie-resources.ts";

function selectableLegendSpendAbility(): Ability {
  return {
    kind: "triggered",
    text: "Spend a chosen Legend.",
    trigger: { trigger: "activated" },
    source: { selector: "self" },
    costs: [
      {
        cost: "spend",
        target: {
          selector: "card",
          controller: "friendly",
          zones: ["legendArea"],
          cardTypes: ["legend"],
          selection: { mode: "choose", min: 1, max: 1 },
        },
      },
    ],
    effects: [],
  };
}

describe("availableEddiesAfterAbilityCosts", () => {
  it("does not count a self-spent Sell Tag Legend as payment for the same ability", () => {
    const source = createMockLegend({ name: "Source", hasSellTag: true });
    const ability: Ability = {
      kind: "triggered",
      text: "1, Spend: Do something.",
      trigger: { trigger: "activated" },
      source: { selector: "self" },
      costs: [
        { cost: "payEddies", amount: 1 },
        { cost: "spend", target: { selector: "self" } },
      ],
      effects: [],
    };
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: source, faceDown: false, spent: false }],
      eddies: 0,
    });
    const sourceId = engine.findCardId(source, "legendArea", P1);

    expect(canPayAbilityEddieCosts(ability, engine.getState(), sourceId, P1)).toBe(false);
  });

  it("pays with another Legend while preserving the Legend reserved for self-spend", () => {
    const ability: Ability = {
      kind: "triggered",
      text: "1, Spend: Do something.",
      trigger: { trigger: "activated" },
      source: { selector: "self" },
      costs: [
        { cost: "payEddies", amount: 1 },
        { cost: "spend", target: { selector: "self" } },
      ],
      effects: [],
    };
    const source = createMockLegend({ name: "Source", hasSellTag: true, abilities: [ability] });
    const payment = createMockLegend({
      name: "Payment",
      hasSellTag: true,
      abilities: [
        {
          kind: "triggered",
          text: "Spend: Do something else.",
          trigger: { trigger: "activated" },
          source: { selector: "self" },
          costs: [{ cost: "spend", target: { selector: "self" } }],
          effects: [],
        },
      ],
    });
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        { card: source, faceDown: false, spent: false },
        { card: payment, faceDown: false, spent: false },
      ],
      eddies: 0,
    });

    expect(engine.activateAbility(source, 0, { as: P1 }).success).toBe(true);
    expect(engine.getCard(source, "legendArea", P1).meta.spent).toBe(true);
    expect(engine.getCard(payment, "legendArea", P1).meta.spent).toBe(true);
  });

  it("does not reserve extra Eddie capacity for a self-spent Legend without a Sell Tag", () => {
    const ability: Ability = {
      kind: "triggered",
      text: "1, Spend: Do something.",
      trigger: { trigger: "activated" },
      source: { selector: "self" },
      costs: [
        { cost: "payEddies", amount: 1 },
        { cost: "spend", target: { selector: "self" } },
      ],
      effects: [],
    };
    const source = createMockLegend({ name: "Source", hasSellTag: false, abilities: [ability] });
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: source, faceDown: false, spent: false }],
      eddies: 1,
    });

    expect(engine.activateAbility(source, 0, { as: P1 }).success).toBe(true);
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCard(source, "legendArea", P1).meta.spent).toBe(true);
  });

  it("charges only the minimum required selectable Legend cost", () => {
    const source = createMockUnit();
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [source],
      legendArea: [
        createMockLegend({ name: "Legend A" }),
        createMockLegend({ name: "Legend B" }),
        createMockLegend({ name: "Legend C" }),
      ],
      eddies: 0,
    });
    const sourceId = engine.findCardId(source, "field", P1);

    expect(
      availableEddiesAfterAbilityCosts(
        selectableLegendSpendAbility(),
        engine.getState(),
        sourceId,
        P1,
      ),
    ).toBe(2);
  });

  it("uses the exact bound selectable cost when one is already chosen", () => {
    const source = createMockUnit();
    const legend = createMockLegend({ name: "Selected Legend" });
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [source],
      legendArea: [
        legend,
        createMockLegend({ name: "Legend B" }),
        createMockLegend({ name: "Legend C" }),
      ],
      eddies: 0,
    });
    const sourceId = engine.findCardId(source, "field", P1);
    const legendId = engine.findCardId(legend, "legendArea", P1);

    expect(
      availableEddiesAfterAbilityCosts(
        selectableLegendSpendAbility(),
        engine.getState(),
        sourceId,
        P1,
        { [abilityCostBindingId(0)]: [legendId] },
      ),
    ).toBe(2);
  });
});
