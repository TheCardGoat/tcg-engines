import { crushAbility } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/small-problem.generated.ts";

export const smallProblem = definePitchFamily(fabPitchFamilies["small-problem"], {
  abilities: () => ({
    hasPowerGreaterThanBaseGetsNumber1Power: {
      kind: "resolution",
      condition: {
        type: "object-numeric-comparison",
        property: "power",
        left: "current",
        op: "gt",
        right: "base",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
    crushAbility: crushAbility({
      effect: {
        type: "destroy",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "opponent",
          zones: ["permanent"],
          filter: {
            typeBox: {
              subtypes: ["Aura"],
            },
          },
          count: 1,
        },
      },
    }),
  }),
});

export const { yellow: smallProblemYellow } = smallProblem.cards;
