import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/point-the-tip.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const pointTheTip = definePitchFamily(fabPitchFamilies["point-the-tip"], {
  parameters: {
    red: { value1: 3, value2: 1, value3: 1, textValue1: 3 },
    yellow: { value1: 2, value2: 1, value3: 1, textValue1: 2 },
    blue: { value1: 1, value2: 1, value3: 1, textValue1: 1 },
  },
  keywords: [goAgain],
  abilities: ({ value1, value2, value3, textValue1: _textValue1 }) => ({
    sequenceModifyNumericPowerThisTurnAddCounterAim: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: value1,
            target: {
              selector: "object",
              declared: "on-stack",
              player: "controller",
              zones: ["arsenal"],
              filter: {
                and: [
                  {
                    typeBox: {
                      subtypes: ["Arrow"],
                    },
                  },
                  {
                    hasStatus: "face-up",
                  },
                ],
              },
              count: value2,
            },
            duration: "this-turn",
            outputBinding: "it",
          },
          {
            type: "add-counter",
            counter: {
              kind: "named",
              name: "aim",
            },
            count: value3,
            target: {
              selector: "binding",
              binding: "it",
            },
          },
        ],
      },
    },
  }),
});

export const {
  red: pointTheTipRed,
  yellow: pointTheTipYellow,
  blue: pointTheTipBlue,
} = pointTheTip.cards;
