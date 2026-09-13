import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/reduce-to-runechant.generated.ts";

export const reduceToRunechant = definePitchFamily(fabPitchFamilies["reduce-to-runechant"], {
  abilities: () => ({
    reduceCostForRunechants: {
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
        duration: "permanent",
      },
    },
    createRunechant: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "runechant",
        controller: "controller",
      },
    },
  }),
});

export const {
  red: reduceToRunechantRed,
  yellow: reduceToRunechantYellow,
  blue: reduceToRunechantBlue,
} = reduceToRunechant.cards;
