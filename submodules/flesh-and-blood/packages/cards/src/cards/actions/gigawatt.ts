import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/gigawatt.generated.ts";
import { goAgain } from "../shared/keywords.ts";
export const gigawatt = definePitchFamily(fabPitchFamilies["gigawatt"], {
  parameters: pitchMap({ red: { value1: 4 }, yellow: { value1: 3 }, blue: { value1: 2 } }),
  keywords: [goAgain],
  abilities: ({ value1 }) => ({
    resolutionModifyNumericPower: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: value1,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              supertypes: ["Mechanologist"],
            },
          },
        },
      },
    },
  }),
});
export const { red: gigawattRed, yellow: gigawattYellow, blue: gigawattBlue } = gigawatt.cards;
