import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/cruel-ambition.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const cruelAmbition = definePitchFamily(fabPitchFamilies["cruel-ambition"], {
  keywords: [goAgain],
  abilities: () => ({
    create3MightTokens: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "might",
        controller: "controller",
        count: 3,
      },
    },
  }),
});
export const { red: cruelAmbitionRed } = cruelAmbition.cards;
