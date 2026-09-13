import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/energy-potion.generated.ts";

export const energyPotion = definePitchFamily(fabPitchFamilies["energy-potion"], {
  abilities: () => ({
    instantDestroyGain: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "gain-resources",
        amount: 2,
      },
    },
  }),
});
export const { blue: energyPotionBlue } = energyPotion.cards;
