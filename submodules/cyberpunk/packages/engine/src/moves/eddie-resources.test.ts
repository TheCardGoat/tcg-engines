import { describe, expect, it } from "vite-plus/test";
import type { Ability } from "@tcg/cyberpunk-types";
import { CyberpunkTestEngine, P1, createMockLegend, createMockUnit } from "../testing/index.ts";
import { abilityCostBindingId, availableEddiesAfterAbilityCosts } from "./eddie-resources.ts";

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
