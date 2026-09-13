import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/argh-smash.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const arghSmash = definePitchFamily(fabPitchFamilies["argh-smash"], {
  keywords: [goAgain],
  abilities: () => ({
    roll6SidedDieDestroyUpXItemsWhere: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "roll",
            sides: 6,
          },
          {
            type: "destroy",
            target: {
              selector: "object",
              declared: "at-resolution",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Item"],
                },
              },
              count: {
                type: "up-to",
                amount: {
                  type: "roll-result",
                  divisor: 2,
                  rounding: "down",
                },
              },
            },
          },
        ],
      },
    },
  }),
});
export const { yellow: arghSmashYellow } = arghSmash.cards;
