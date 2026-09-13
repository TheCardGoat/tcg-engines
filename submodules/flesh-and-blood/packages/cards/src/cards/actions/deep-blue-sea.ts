import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/deep-blue-sea.generated.ts";

export const deepBlueSea = definePitchFamily(fabPitchFamilies["deep-blue-sea"], {
  abilities: () => ({
    gets1EachBlueVePitchedTurn: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: {
          type: "count",
          what: "cards-pitched-this-turn",
          filter: {
            color: ["blue"],
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
export const { blue: deepBlueSeaBlue } = deepBlueSea.cards;
