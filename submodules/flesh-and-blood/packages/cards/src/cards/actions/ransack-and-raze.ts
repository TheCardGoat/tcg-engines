import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/ransack-and-raze.generated.ts";

export const ransackAndRaze = definePitchFamily(fabPitchFamilies["ransack-and-raze"], {
  keywords: [goAgain],
  abilities: () => ({
    destroyTargetLandmarkCostXCreateXGoldTokens: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "destroy",
            outputBinding: "it",
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Landmark"],
                },
              },
              count: 1,
            },
          },
          {
            type: "create-token",
            token: "gold",
            controller: "controller",
            count: {
              type: "reference",
              binding: "it",
              property: "cost",
              missing: "zero",
            },
          },
        ],
      },
    },
  }),
});

export const { blue: ransackAndRazeBlue } = ransackAndRaze.cards;
