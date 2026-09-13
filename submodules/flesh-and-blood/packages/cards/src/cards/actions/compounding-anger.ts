import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/compounding-anger.generated.ts";

export const compoundingAnger = definePitchFamily(fabPitchFamilies["compounding-anger"], {
  abilities: () => ({
    costsLessPlayEachDraconicChainLinkControl: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "cost",
        op: "subtract",
        amount: {
          type: "count",
          what: "chain-links",
          player: "controller",
          filter: {
            typeBox: {
              supertypes: ["Draconic"],
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
export const { red: compoundingAngerRed } = compoundingAnger.cards;
