import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/invigorate.generated.ts";

export const invigorate = definePitchFamily(fabPitchFamilies["invigorate"], {
  keywords: [goAgain],

  abilities: () => ({
    modifyNumericPowerThisTurn: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 4,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Attack"],
            },
            hasStatus: "fused",
          },
        },
      },
    },
  }),
});
export const {
  red: invigorateRed,
  yellow: invigorateYellow,
  blue: invigorateBlue,
} = invigorate.cards;
