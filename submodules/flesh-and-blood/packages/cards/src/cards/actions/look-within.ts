import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/look-within.generated.ts";

export const lookWithin = definePitchFamily(fabPitchFamilies["look-within"], {
  keywords: [goAgain],
  abilities: () => ({
    searchDeckChiRevealShuffleThenPutTop: {
      kind: "resolution",
      effect: {
        type: "search",
        zones: ["deck"],
        filter: {
          typeBox: {
            subtypes: ["Chi"],
          },
        },
        mayFail: true,
        to: {
          zone: "deck",
          position: "top",
        },
      },
    },
  }),
});

export const { blue: lookWithinBlue } = lookWithin.cards;
