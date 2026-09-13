import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/over-flex.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const overFlex = definePitchFamily(fabPitchFamilies["over-flex"], {
  parameters: {
    red: { value1: 4, textValue1: 4 },
    yellow: { value1: 3, textValue1: 3 },
    blue: { value1: 2, textValue1: 2 },
  },
  keywords: [
    {
      name: "reload",
    },
    goAgain,
  ],
  abilities: ({ value1, textValue1: _textValue1 }) => ({
    modifyNumericPowerThisTurn: {
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
              subtypes: ["Arrow"],
            },
          },
        },
      },
    },
  }),
});

export const { red: overFlexRed, yellow: overFlexYellow, blue: overFlexBlue } = overFlex.cards;
