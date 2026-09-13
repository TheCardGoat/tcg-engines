import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/show-of-strength.generated.ts";

export const showOfStrength = definePitchFamily(fabPitchFamilies["show-of-strength"], {
  abilities: () => ({
    getsNumber1PowerForEachWithNumber6MorePowerDefending: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "subtract",
        amount: {
          type: "count",
          what: "cards-defending",
          per: "chain-link",
          filter: {
            power: {
              op: "gte",
              value: 6,
            },
          },
        },
        target: {
          selector: "self",
        },
        duration: "while-in-arena",
      },
    },
  }),
});

export const { red: showOfStrengthRed } = showOfStrength.cards;
