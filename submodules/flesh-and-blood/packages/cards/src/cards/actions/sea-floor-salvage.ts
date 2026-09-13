import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sea-floor-salvage.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const seaFloorSalvage = definePitchFamily(fabPitchFamilies["sea-floor-salvage"], {
  keywords: [goAgain],
  abilities: () => ({
    turnInGraveyardFaceDownSYellowCreateGoldToken: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "turn-face-down",
            target: {
              selector: "object",
              declared: "at-resolution",
              zones: ["graveyard"],
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "it",
              filter: {
                color: ["yellow"],
              },
            },
            then: {
              type: "create-token",
              token: "gold",
              controller: "controller",
            },
          },
        ],
      },
    },
  }),
});

export const { blue: seaFloorSalvageBlue } = seaFloorSalvage.cards;
