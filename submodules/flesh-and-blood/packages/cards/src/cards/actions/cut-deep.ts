import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/cut-deep.generated.ts";
import { goAgain } from "../shared/keywords.ts";
export const cutDeep = definePitchFamily(fabPitchFamilies["cut-deep"], {
  parameters: pitchMap({ red: 4, yellow: 3, blue: 2 }),
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
              subtypes: ["Dagger"],
            },
          },
        },
      },
    },
  }),
});
export const { red: cutDeepRed, yellow: cutDeepYellow, blue: cutDeepBlue } = cutDeep.cards;
