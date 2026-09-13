import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/read-the-glide-path.generated.ts";
import { goAgain, opt } from "../shared/keywords.ts";

export const readTheGlidePath = definePitchFamily(fabPitchFamilies["read-the-glide-path"], {
  parameters: {
    red: { value1: 3, textValue1: 3, textValue2: 1 },
    yellow: { value1: 2, textValue1: 2, textValue2: 1 },
    blue: { value1: 1, textValue1: 1, textValue2: 1 },
  },
  keywords: [opt(1), goAgain],
  abilities: ({ value1, textValue1: _textValue1, textValue2: _textValue2 }) => ({
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

export const {
  red: readTheGlidePathRed,
  yellow: readTheGlidePathYellow,
  blue: readTheGlidePathBlue,
} = readTheGlidePath.cards;
