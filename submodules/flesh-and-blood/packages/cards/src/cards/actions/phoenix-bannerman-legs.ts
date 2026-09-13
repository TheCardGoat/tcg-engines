import { goAgain, legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/phoenix-bannerman-legs.generated.ts";

export const phoenixBannermanLegs = definePitchFamily(fabPitchFamilies["phoenix-bannerman-legs"], {
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
    createAgilityToken: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "agility",
        controller: "controller",
      },
    },
  }),
});

export const { red: phoenixBannermanLegsRed } = phoenixBannermanLegs.cards;
