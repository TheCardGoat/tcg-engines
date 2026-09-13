import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/second-swing.generated.ts";

export const secondSwing = definePitchFamily(fabPitchFamilies["second-swing"], {
  parameters: pitchMap({ red: { value1: 4 }, yellow: { value1: 3 }, blue: { value1: 2 } }),
  keywords: [goAgain],
  abilities: ({ value1 }) => ({
    resolutionModifyNumeric: {
      kind: "resolution",
      condition: {
        type: "performed-this-turn",
        event: "attack-with-weapon",
        player: "controller",
      },
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
              subtypes: ["Attack"],
            },
          },
        },
      },
    },
  }),
});

export const {
  red: secondSwingRed,
  yellow: secondSwingYellow,
  blue: secondSwingBlue,
} = secondSwing.cards;
