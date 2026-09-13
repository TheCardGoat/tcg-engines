import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/big-blue-sky.generated.ts";

export const bigBlueSky = definePitchFamily(fabPitchFamilies["big-blue-sky"], {
  abilities: () => ({
    gainDefenseForBlueCardsPitched: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "defense",
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

export const { blue: bigBlueSkyBlue } = bigBlueSky.cards;
