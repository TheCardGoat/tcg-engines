import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/lay-down-the-challenge.generated.ts";

export const layDownTheChallenge = definePitchFamily(fabPitchFamilies["lay-down-the-challenge"], {
  keywords: [goAgain],
  abilities: () => ({
    intimidateTargetThenMoreHandThanDraw: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "intimidate",
            target: "opponent",
          },
          {
            type: "conditional",
            condition: {
              type: "compare-amount",
              amount: {
                type: "count",
                what: "cards-in-hand",
                player: "opponent",
              },
              comparison: {
                op: "gt",
                value: {
                  type: "count",
                  what: "cards-in-hand",
                  player: "controller",
                },
              },
            },
            then: {
              type: "draw",
              count: 1,
              player: "controller",
            },
          },
        ],
      },
      label: {
        name: "intimidate",
      },
    },
  }),
});

export const { yellow: layDownTheChallengeYellow } = layDownTheChallenge.cards;
