import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/break-open-the-chests.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const breakOpenTheChests = definePitchFamily(fabPitchFamilies["break-open-the-chests"], {
  keywords: [goAgain],
  abilities: () => ({
    turnAllAllArsenalsFaceUpThenIfThere: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "turn-face-up",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "each",
              zones: ["arsenal"],
              count: {
                type: "all",
              },
            },
          },
          {
            type: "conditional",
            condition: {
              type: "zone-count",
              zone: "arsenal",
              player: "any",
              filter: {
                color: ["yellow"],
                hasStatus: "face-up",
              },
              comparison: {
                op: "gte",
                value: 1,
              },
            },
            then: {
              type: "create-token",
              token: "gold",
              controller: "controller",
              count: 2,
            },
          },
        ],
      },
    },
  }),
});
export const { yellow: breakOpenTheChestsYellow } = breakOpenTheChests.cards;
