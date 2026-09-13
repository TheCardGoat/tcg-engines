import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/bleed-out.generated.ts";

export const bleedOut = definePitchFamily(fabPitchFamilies["bleed-out"], {
  supertypeSets: [["Assassin"], ["Ninja"]],
  keywords: [goAgain],

  abilities: () => ({
    continuousModifyNumericCost: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "cost",
        op: "subtract",
        amount: {
          type: "count",
          what: "damage-dealt",
          per: "chain-link",
          filter: {
            typeBox: {
              subtypes: ["Dagger"],
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
export const { red: bleedOutRed, yellow: bleedOutYellow, blue: bleedOutBlue } = bleedOut.cards;
