import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tentacular-toll.generated.ts";

export const tentacularToll = definePitchFamily(fabPitchFamilies["tentacular-toll"], {
  parameters: pitchMap({ red: { value1: 3 }, yellow: { value1: 2 }, blue: { value1: 1 } }),
  keywords: [goAgain],
  abilities: ({ value1 }) => ({
    resolutionSequence: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "turn-face-down",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["graveyard"],
              filter: {
                typeBox: {
                  subtypes: ["Ally"],
                },
              },
              count: { type: "up-to", amount: value1 },
            },
          },
          {
            type: "create-token",
            token: "gold",
            controller: "controller",
            count: {
              type: "count",
              what: "turned-face-down-this-way",
            },
          },
        ],
      },
    },
  }),
});

export const {
  red: tentacularTollRed,
  yellow: tentacularTollYellow,
  blue: tentacularTollBlue,
} = tentacularToll.cards;
