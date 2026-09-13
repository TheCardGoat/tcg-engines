import { goAgain, legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/phoenix-bannerman-chest.generated.ts";

export const phoenixBannermanChest = definePitchFamily(
  fabPitchFamilies["phoenix-bannerman-chest"],
  {
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
      createVigorToken: {
        kind: "resolution",
        effect: {
          type: "create-token",
          token: "vigor",
          controller: "controller",
        },
      },
    }),
  },
);

export const { red: phoenixBannermanChestRed } = phoenixBannermanChest.cards;
