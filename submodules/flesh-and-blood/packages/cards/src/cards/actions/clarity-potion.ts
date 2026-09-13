import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/clarity-potion.generated.ts";

export const clarityPotion = definePitchFamily(fabPitchFamilies["clarity-potion"], {
  abilities: () => ({
    instantDestroyClarityPotionOpt2: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "opt",
        count: 2,
      },
    },
  }),
});
export const { blue: clarityPotionBlue } = clarityPotion.cards;
