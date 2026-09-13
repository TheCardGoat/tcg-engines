import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/diamond-amulet.generated.ts";

import { legendary, wateryGrave } from "../shared/keywords.ts";

export const diamondAmulet = definePitchFamily(fabPitchFamilies["diamond-amulet"], {
  keywords: [legendary, wateryGrave],
  abilities: () => ({
    instantDestroyGain1ActionPoint: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "gain-action-points",
        amount: 1,
      },
    },
  }),
});
export const { blue: diamondAmuletBlue } = diamondAmulet.cards;
