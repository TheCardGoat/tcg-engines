import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/nock-the-deathwhistle.generated.ts";

export const nockTheDeathwhistle = definePitchFamily(fabPitchFamilies["nock-the-deathwhistle"], {
  keywords: [
    {
      name: "specialization",
      hero: "Azalea",
    },
    {
      name: "reload",
    },
    goAgain,
  ],
  abilities: () => ({
    searchDeckArrowRevealThenShuffleDeckPutTopDeck: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "search",
            zones: ["deck"],
            filter: {
              typeBox: {
                subtypes: ["Arrow"],
              },
            },
            mayFail: true,
            to: {
              zone: "deck",
              position: "top",
            },
          },
        ],
      },
    },
  }),
});

export const { blue: nockTheDeathwhistleBlue } = nockTheDeathwhistle.cards;
