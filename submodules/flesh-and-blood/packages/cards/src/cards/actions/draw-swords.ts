import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/draw-swords.generated.ts";
import { goAgain } from "../shared/keywords.ts";
export const drawSwords = definePitchFamily(fabPitchFamilies["draw-swords"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
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
              supertypes: ["Warrior"],
            },
          },
        },
      },
    },
    resolutionDraw: {
      kind: "resolution",
      effect: {
        type: "draw",
        count: 1,
        player: "controller",
      },
    },
  }),
});
export const {
  red: drawSwordsRed,
  yellow: drawSwordsYellow,
  blue: drawSwordsBlue,
} = drawSwords.cards;
