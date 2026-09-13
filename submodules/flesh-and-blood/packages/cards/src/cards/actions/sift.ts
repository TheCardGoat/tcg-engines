import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sift.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const sift = definePitchFamily(fabPitchFamilies.sift, {
  parameters: pitchMap({ red: { maxCards: 4 }, yellow: { maxCards: 3 }, blue: { maxCards: 2 } }),
  keywords: [goAgain],
  abilities: ({ maxCards }) => ({
    siftHand: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              count: { type: "up-to", amount: maxCards },
            },
            to: { zone: "deck", position: "bottom" },
          },
          {
            type: "draw",
            count: { type: "count", what: "put-on-bottom-this-way" },
            player: "controller",
          },
        ],
      },
    },
  }),
});

export const { red: siftRed, yellow: siftYellow, blue: siftBlue } = sift.cards;
