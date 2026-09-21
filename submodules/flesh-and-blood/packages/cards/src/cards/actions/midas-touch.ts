import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/midas-touch.generated.ts";

export const midasTouch = definePitchFamily(fabPitchFamilies["midas-touch"], {
  keywords: [goAgain],
  abilities: () => ({
    destroyTargetAllyControllerCreatesGoldTokensEqualCost: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "destroy",
            target: {
              selector: "object",
              declared: "on-stack",
              player: "any",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Ally"],
                },
              },
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "create-token",
            token: "gold",
            creator: "token-controller",
            controller: "target-controller",
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

export const { yellow: midasTouchYellow } = midasTouch.cards;
