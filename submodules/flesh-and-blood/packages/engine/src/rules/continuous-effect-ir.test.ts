import { describe, expect, it } from "vite-plus/test";
import { FAB_CONTINUOUS_ATOM_STAGE, type FabRulesStage } from "./continuous/ir.ts";

describe("continuous-effect IR completeness", () => {
  it("assigns every atom kind to the CR 6.3 rule pass or stages 1-8", () => {
    expect(FAB_CONTINUOUS_ATOM_STAGE).toEqual({
      rule: "rule",
      copy: 1,
      become: 1,
      controller: 2,
      identity: 3,
      type: 4,
      supertype: 5,
      ability: 6,
      "copy-abilities": 6,
      "base-numeric": 7,
      numeric: 8,
      "activation-cost": 8,
    });
  });

  it("covers every object stage in the atom ownership map", () => {
    const stages = Object.values(FAB_CONTINUOUS_ATOM_STAGE).filter(
      (stage): stage is FabRulesStage => typeof stage === "number",
    );
    expect(new Set(stages)).toEqual(new Set([1, 2, 3, 4, 5, 6, 7, 8]));
  });
});
