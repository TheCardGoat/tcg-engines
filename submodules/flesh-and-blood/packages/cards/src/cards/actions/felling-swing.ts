import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/felling-swing.generated.ts";
import { goAgain } from "../shared/keywords.ts";
export const fellingSwing = definePitchFamily(fabPitchFamilies["felling-swing"], {
  parameters: pitchMap({ red: 6, yellow: 5, blue: 4 }),
  keywords: [goAgain],
  abilities: (amount) => ({
    resolutionModifyNumericPower: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Axe"],
            },
          },
        },
      },
    },
  }),
});
export const {
  red: fellingSwingRed,
  yellow: fellingSwingYellow,
  blue: fellingSwingBlue,
} = fellingSwing.cards;
