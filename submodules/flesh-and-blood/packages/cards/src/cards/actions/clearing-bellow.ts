import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/clearing-bellow.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const clearingBellow = definePitchFamily(fabPitchFamilies["clearing-bellow"], {
  keywords: [goAgain],
  abilities: () => ({
    intimidate: {
      kind: "resolution",
      effect: {
        type: "intimidate",
        target: "opponent",
      },
    },
  }),
});
export const { blue: clearingBellowBlue } = clearingBellow.cards;
