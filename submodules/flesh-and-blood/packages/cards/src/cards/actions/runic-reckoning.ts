import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/runic-reckoning.generated.ts";

export const runicReckoning = definePitchFamily(fabPitchFamilies["runic-reckoning"], {
  keywords: [goAgain],
  abilities: () => ({
    costsResourceLessPlayRunechant: {
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
            name: "Runechant",
          },
        },
        target: {
          selector: "self",
        },
        duration: "while-in-arena",
      },
    },
    nextRunebladeAttackActionPlayTurnGets3Power: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              supertypes: ["Runeblade"],
              types: ["Action"],
              subtypes: ["Attack"],
            },
          },
        },
      },
    },
  }),
});

export const { red: runicReckoningRed } = runicReckoning.cards;
