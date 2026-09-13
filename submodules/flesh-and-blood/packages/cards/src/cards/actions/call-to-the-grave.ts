import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/call-to-the-grave.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const callToTheGrave = definePitchFamily(fabPitchFamilies["call-to-the-grave"], {
  keywords: [goAgain],
  abilities: () => ({
    searchDeckPutIntoGraveyardThenShuffle: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "search",
            zones: ["deck"],
            filter: {},
            mayFail: true,
            to: {
              zone: "graveyard",
            },
          },
          {
            type: "shuffle",
            zone: "deck",
          },
        ],
      },
    },
  }),
});
export const { blue: callToTheGraveBlue } = callToTheGrave.cards;
