import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/quickfire.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const quickfire = definePitchFamily(fabPitchFamilies["quickfire"], {
  parameters: { red: { value1: 4 }, yellow: { value1: 3 }, blue: { value1: 2 } },
  keywords: [goAgain],
  abilities: ({ value1 }) => ({
    continuousModifyNumericCostCountHyperDriverWhileInArena: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "cost",
        op: "subtract",
        amount: {
          type: "count",
          what: "cards-in-zone",
          zone: "permanent",
          player: "controller",
          filter: {
            name: "Hyper Driver",
          },
        },
        target: {
          selector: "self",
        },
        duration: "while-in-arena",
      },
    },
    modifyNumericPowerThisTurn: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: value1,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Attack"],
            },
            hasStatus: "boosted",
          },
        },
      },
    },
  }),
});

export const { red: quickfireRed, yellow: quickfireYellow, blue: quickfireBlue } = quickfire.cards;
