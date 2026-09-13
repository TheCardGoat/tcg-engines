import { goAgain, legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/phoenix-bannerman-head.generated.ts";

export const phoenixBannermanHead = definePitchFamily(fabPitchFamilies["phoenix-bannerman-head"], {
  keywords: [legendary, goAgain],
  abilities: () => ({
    searchDeckPhoenixFlameRevealPutHandThenShuffle: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "search",
            zones: ["deck"],
            filter: {
              name: "Phoenix Flame",
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
    createPonderToken: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "ponder",
        controller: "controller",
      },
    },
  }),
});

export const { red: phoenixBannermanHeadRed } = phoenixBannermanHead.cards;
