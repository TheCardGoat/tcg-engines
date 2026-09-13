import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/silver-the-tip.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const silverTheTip = definePitchFamily(fabPitchFamilies["silver-the-tip"], {
  parameters: pitchMap({
    red: { value1: 0, value2: 4, value3: 1, textValue1: 4 },
    yellow: { value1: 0, value2: 3, value3: 1, textValue1: 3 },
    blue: { value1: 0, value2: 2, value3: 1, textValue1: 2 },
  }),
  keywords: [goAgain],
  abilities: ({ value1, value2, value3, textValue1: _textValue1 }) => ({
    resolutionSequence: {
      kind: "resolution",
      condition: {
        type: "zone-count",
        zone: "arsenal",
        player: "controller",
        comparison: {
          op: "eq",
          value: value1,
        },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "look",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["deck"],
              position: "top",
              count: value2,
            },
            outputBinding: "them",
          },
          {
            type: "optional",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "choose-card",
                  target: {
                    selector: "binding",
                    binding: "them",
                    filter: {
                      typeBox: {
                        subtypes: ["Arrow"],
                      },
                    },
                    count: value3,
                  },
                  outputBinding: "chosen-arrow",
                },
                {
                  type: "move-card",
                  target: {
                    selector: "binding",
                    binding: "chosen-arrow",
                  },
                  to: {
                    zone: "arsenal",
                  },
                  faceDown: false,
                },
              ],
            },
          },
          {
            type: "move-card",
            target: {
              selector: "binding",
              binding: "them",
              exclude: "chosen-arrow",
            },
            to: {
              zone: "deck",
              position: "bottom",
            },
          },
        ],
      },
    },
  }),
});

export const {
  red: silverTheTipRed,
  yellow: silverTheTipYellow,
  blue: silverTheTipBlue,
} = silverTheTip.cards;
