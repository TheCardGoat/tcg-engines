import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/three-of-a-kind.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const threeOfAKind = definePitchFamily(fabPitchFamilies["three-of-a-kind"], {
  keywords: [goAgain],
  abilities: () => ({
    drawNumber3UntilEndTurnOnlyPlayFromArsenal: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            count: 3,
            player: "controller",
          },
          {
            type: "rule-modification",
            mode: "require",
            action: "play",
            subject: {
              playedFromZones: ["arsenal"],
            },
            duration: "this-turn",
          },
        ],
      },
    },
  }),
});

export const { red: threeOfAKindRed } = threeOfAKind.cards;
