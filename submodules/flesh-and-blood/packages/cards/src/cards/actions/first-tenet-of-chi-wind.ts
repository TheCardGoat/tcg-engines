import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/first-tenet-of-chi-wind.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const firstTenetOfChiWind = definePitchFamily(fabPitchFamilies["first-tenet-of-chi-wind"], {
  keywords: [goAgain],
  abilities: () => ({
    nextBlueActionPlayTurnGetsGoAgain: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              types: ["Action"],
            },
            color: ["blue"],
          },
        },
      },
    },
  }),
});
export const { blue: firstTenetOfChiWindBlue } = firstTenetOfChiWind.cards;
