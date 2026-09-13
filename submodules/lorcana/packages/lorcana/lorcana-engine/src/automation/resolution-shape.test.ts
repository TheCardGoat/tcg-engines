import { describe, expect, it } from "bun:test";
import type { Effect } from "@tcg/lorcana-types";
import {
  getImmediatePlanningEffect,
  inspectFullResolutionShape,
  inspectImmediateResolutionShape,
} from "./resolution-shape";

/** Pocahontas & Meeko WELCOME RETURN shape */
const meekoWelcomeReturn: Effect = {
  type: "optional",
  chooser: "CONTROLLER",
  effect: {
    type: "sequence",
    steps: [
      {
        type: "return-to-hand",
        target: {
          selector: "chosen",
          count: 1,
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [{ type: "cost-comparison", comparison: "equal", value: 1 }],
        },
      },
      {
        type: "conditional",
        condition: { type: "if-you-do" },
        then: {
          type: "optional",
          chooser: "CONTROLLER",
          effect: {
            type: "play-card",
            from: "hand",
            cardType: "character",
            costRestriction: { comparison: "equal", value: 1 },
            cost: "free",
          },
        },
      },
    ],
  },
};

/** Julieta SIGNATURE RECIPE shape — sequence of two mays */
const julietaSignatureRecipe: Effect = {
  type: "sequence",
  steps: [
    {
      type: "optional",
      chooser: "CONTROLLER",
      effect: {
        type: "remove-damage",
        amount: { type: "up-to", value: 2 },
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
    {
      type: "conditional",
      condition: { type: "if-you-do" },
      then: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    },
  ],
};

/** John Silver — single may, mandatory follow-up */
const johnSilverCourse: Effect = {
  type: "optional",
  chooser: "CONTROLLER",
  effect: {
    type: "sequence",
    steps: [
      {
        type: "deal-damage",
        amount: 1,
        target: {
          selector: "chosen",
          count: 1,
          owner: "you",
          excludeSelf: true,
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      {
        type: "conditional",
        condition: { type: "if-you-do" },
        then: {
          type: "sequence",
          steps: [
            { type: "ready", target: { ref: "previous-target" } },
            {
              type: "restriction",
              duration: "this-turn",
              restriction: "cant-quest",
              target: { ref: "previous-target" },
            },
          ],
        },
      },
    ],
  },
};

describe("inspectImmediateResolutionShape", () => {
  it("counts only the outer may for Meeko-style nested optionals", () => {
    const full = inspectFullResolutionShape(meekoWelcomeReturn);
    const immediate = inspectImmediateResolutionShape(meekoWelcomeReturn);

    expect(full.optionalCount).toBe(2);
    expect(immediate.optionalCount).toBe(1);
    expect(immediate.choiceCount).toBe(0);
  });

  it("counts only the first may for Julieta-style sequence of optionals", () => {
    const full = inspectFullResolutionShape(julietaSignatureRecipe);
    const immediate = inspectImmediateResolutionShape(julietaSignatureRecipe);

    expect(full.optionalCount).toBe(2);
    expect(immediate.optionalCount).toBe(1);
  });

  it("keeps single-optional if-you-do trees at optionalCount 1", () => {
    const immediate = inspectImmediateResolutionShape(johnSilverCourse);
    expect(immediate.optionalCount).toBe(1);
    expect(immediate.choiceCount).toBe(0);
  });

  it("marks nested choice/or under an option as unsupported multi-choice", () => {
    const nestedChoice: Effect = {
      type: "or",
      options: [
        {
          type: "or",
          options: [
            { type: "draw", amount: 1, target: "CONTROLLER" },
            { type: "banish", target: "SELF" },
          ],
        },
        { type: "draw", amount: 1, target: "CONTROLLER" },
      ],
    };

    // Runtime reuses choiceIndex into the selected arm, so nested or is not a
    // separate residual — flag choiceCount > 1 for the unsupported-shape rail.
    const immediate = inspectImmediateResolutionShape(nestedChoice);
    expect(immediate.choiceCount).toBe(2);
    expect(immediate.choiceOptionCount).toBe(2);
  });

  it("marks nested choice later in a sequence option as unsupported multi-choice", () => {
    const nestedInSequence: Effect = {
      type: "or",
      options: [
        {
          type: "sequence",
          steps: [
            { type: "draw", amount: 1, target: "CONTROLLER" },
            {
              type: "or",
              options: [
                { type: "draw", amount: 1, target: "CONTROLLER" },
                { type: "banish", target: "SELF" },
              ],
            },
          ],
        },
        { type: "draw", amount: 1, target: "CONTROLLER" },
      ],
    };
    expect(inspectImmediateResolutionShape(nestedInSequence).choiceCount).toBe(2);
  });

  it("marks nested choice under a pay-cost wrapper as unsupported multi-choice", () => {
    const nestedUnderPayCost: Effect = {
      type: "or",
      options: [
        {
          type: "pay-cost",
          cost: { ink: 1 },
          effect: {
            type: "or",
            options: [
              { type: "draw", amount: 1, target: "CONTROLLER" },
              { type: "banish", target: "SELF" },
            ],
          },
        },
        { type: "draw", amount: 1, target: "CONTROLLER" },
      ],
    };
    expect(inspectImmediateResolutionShape(nestedUnderPayCost).choiceCount).toBe(2);
  });

  it("does not assume the true branch for dual-arm conditionals (Buzz/Woody)", () => {
    const dualArm: Effect = {
      type: "conditional",
      condition: {
        type: "has-character-count",
        controller: "you",
        comparison: "greater-or-equal",
        count: 2,
        classification: "Toy",
      },
      then: {
        type: "sequence",
        steps: [
          {
            type: "optional",
            chooser: "CONTROLLER",
            effect: { type: "draw", amount: 1, target: "CONTROLLER" },
          },
          {
            type: "optional",
            chooser: "CONTROLLER",
            effect: { type: "draw", amount: 1, target: "CONTROLLER" },
          },
        ],
      },
      else: {
        type: "choice",
        chooser: "CONTROLLER",
        options: [
          {
            type: "optional",
            chooser: "CONTROLLER",
            effect: { type: "draw", amount: 1, target: "CONTROLLER" },
          },
          {
            type: "optional",
            chooser: "CONTROLLER",
            effect: { type: "draw", amount: 1, target: "CONTROLLER" },
          },
        ],
      },
    };

    const immediate = inspectImmediateResolutionShape(dualArm);
    // Must not peel into then → first optional (that would force optionalCount 1
    // and hide the else choice arm).
    expect(immediate.optionalCount).toBe(0);
    expect(immediate.choiceCount).toBe(0);
  });
});

describe("getImmediatePlanningEffect", () => {
  it("peels Meeko to the return-to-hand step for target planning", () => {
    const planning = getImmediatePlanningEffect(meekoWelcomeReturn);
    expect(planning).toMatchObject({ type: "return-to-hand" });
  });

  it("peels Julieta to remove-damage under the first optional", () => {
    const planning = getImmediatePlanningEffect(julietaSignatureRecipe);
    expect(planning).toMatchObject({ type: "remove-damage" });
  });

  it("peels a residual free-play optional to play-card", () => {
    const freePlayMay: Effect = {
      type: "optional",
      chooser: "CONTROLLER",
      effect: {
        type: "play-card",
        from: "hand",
        cardType: "character",
        cost: "free",
      },
    };
    expect(getImmediatePlanningEffect(freePlayMay)).toMatchObject({ type: "play-card" });
  });

  it("preserves dual-arm conditionals instead of baking in the true branch", () => {
    const dualArm: Effect = {
      type: "conditional",
      condition: { type: "if-you-do" },
      then: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: { type: "draw", amount: 1, target: "CONTROLLER" },
      },
      else: {
        type: "choice",
        chooser: "CONTROLLER",
        options: [{ type: "draw", amount: 1, target: "CONTROLLER" }],
      },
    };
    expect(getImmediatePlanningEffect(dualArm)).toBe(dualArm);
  });
});
