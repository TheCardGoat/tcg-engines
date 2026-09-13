import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/call-in-the-big-guns.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const callInTheBigGuns = definePitchFamily(fabPitchFamilies["call-in-the-big-guns"], {
  parameters: pitchMap({
    red: { value1: 3, value2: 1, textValue1: 3 },
    yellow: { value1: 2, value2: 1, textValue1: 2 },
    blue: { value1: 1, value2: 1, textValue1: 1 },
  }),
  keywords: [goAgain],
  abilities: ({ value1, value2, textValue1: _textValue1 }) => ({
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
              subtypes: ["Arrow"],
            },
          },
        },
      },
    },
    resolutionOptionalMove: {
      kind: "resolution",
      effect: {
        type: "optional",
        effect: {
          type: "move-card",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["hand"],
            filter: {
              typeBox: {
                subtypes: ["Arrow"],
              },
            },
            count: value2,
          },
          to: {
            zone: "arsenal",
            visibility: "face-up",
          },
          outputBinding: "it",
        },
      },
    },
  }),
});

export const {
  red: callInTheBigGunsRed,
  yellow: callInTheBigGunsYellow,
  blue: callInTheBigGunsBlue,
} = callInTheBigGuns.cards;
