import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/encore.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const encore = definePitchFamily(fabPitchFamilies["encore"], {
  keywords: [goAgain],
  abilities: () => ({
    returnBardAttackActionFromGraveyardHand: {
      kind: "resolution",
      effect: {
        type: "move-card",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["graveyard"],
          filter: {
            typeBox: {
              supertypes: ["Bard"],
              types: ["Action"],
              subtypes: ["Attack"],
            },
          },
          count: 1,
        },
        to: {
          zone: "hand",
        },
      },
    },
  }),
});
export const { yellow: encoreYellow } = encore.cards;
