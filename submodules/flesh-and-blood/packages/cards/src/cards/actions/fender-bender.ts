import { boost } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/fender-bender.generated.ts";

export const fenderBender = definePitchFamily(fabPitchFamilies["fender-bender"], {
  keywords: [boost],
  abilities: () => ({
    modifyNumericPower: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: {
          type: "count",
          what: "cards-defending",
          per: "chain-link",
          filter: {
            typeBox: {
              types: ["Equipment"],
            },
          },
        },
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const {
  red: fenderBenderRed,
  yellow: fenderBenderYellow,
  blue: fenderBenderBlue,
} = fenderBender.cards;
