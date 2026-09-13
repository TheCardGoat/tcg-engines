import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/predatory-streak.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const predatoryStreak = definePitchFamily(fabPitchFamilies["predatory-streak"], {
  parameters: { red: { count: 3 }, yellow: { count: 2 }, blue: { count: 1 } },
  keywords: [goAgain],
  abilities: ({ count }) => ({
    sequenceCreateTokenCrouchingTigersOptionalPlayCardThisTurn: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "create-token",
            token: "crouching-tiger",
            controller: "controller",
            count,
            to: {
              zone: "banished",
            },
            outputBinding: "it",
          },
          {
            type: "optional",
            effect: {
              type: "play-card",
              fromZones: ["banished"],
              source: {
                selector: "binding",
                binding: "it",
              },
              duration: "this-turn",
            },
          },
        ],
      },
    },
  }),
});

export const {
  red: predatoryStreakRed,
  yellow: predatoryStreakYellow,
  blue: predatoryStreakBlue,
} = predatoryStreak.cards;
