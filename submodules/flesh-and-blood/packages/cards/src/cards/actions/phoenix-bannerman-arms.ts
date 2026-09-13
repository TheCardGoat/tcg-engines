import { goAgain, legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/phoenix-bannerman-arms.generated.ts";

export const phoenixBannermanArms = definePitchFamily(fabPitchFamilies["phoenix-bannerman-arms"], {
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
    createMightToken: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "might",
        controller: "controller",
      },
    },
  }),
});

export const { red: phoenixBannermanArmsRed } = phoenixBannermanArms.cards;
