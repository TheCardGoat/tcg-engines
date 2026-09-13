import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/barnacle.generated.ts";

import { wateryGrave } from "../shared/keywords.ts";

export const barnacle = definePitchFamily(fabPitchFamilies["barnacle"], {
  keywords: [wateryGrave],
  abilities: () => ({
    actionAttack: {
      kind: "activated",
      abilityType: "attack",
      cost: {
        class: "effect",
        type: "tap-self",
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
  }),
});
export const { yellow: barnacleYellow } = barnacle.cards;
