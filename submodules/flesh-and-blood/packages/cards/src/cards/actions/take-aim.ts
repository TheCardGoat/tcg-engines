import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/take-aim.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const takeAim = definePitchFamily(fabPitchFamilies["take-aim"], {
  parameters: pitchMap({
    red: { value1: 3, textValue1: 3 },
    yellow: { value1: 2, textValue1: 2 },
    blue: { value1: 1, textValue1: 1 },
  }),
  keywords: [
    {
      name: "reload",
    },
    goAgain,
  ],
  abilities: ({ value1, textValue1: _textValue1 }) => ({
    resolutionModifyNumeric: {
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
              supertypes: ["Ranger"],
              types: ["Action"],
              subtypes: ["Attack"],
            },
          },
        },
      },
    },
  }),
});

export const { red: takeAimRed, yellow: takeAimYellow, blue: takeAimBlue } = takeAim.cards;
