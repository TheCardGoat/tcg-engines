import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/reel-in.generated.ts";

export const reelIn = definePitchFamily(fabPitchFamilies["reel-in"], {
  keywords: [
    {
      name: "reload",
    },
  ],
  abilities: () => ({
    lookAtTopX1DeckChooseUp4: {
      kind: "resolution",
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
              count: {
                type: "sum",
                operands: [
                  {
                    type: "x",
                  },
                  1,
                ],
              },
            },
            outputBinding: "it",
          },
          {
            type: "search",
            zones: [],
            fromBinding: "it",
            filter: {
              typeBox: {
                subtypes: ["Trap"],
              },
            },
            count: {
              type: "up-to",
              amount: 4,
            },
            mayFail: true,
            to: {
              zone: "hand",
            },
          },
          {
            type: "shuffle",
            zone: "deck",
          },
        ],
      },
    },
  }),
});

export const { blue: reelInBlue } = reelIn.cards;
