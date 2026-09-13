import { legendary, wateryGrave } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/ruby-amulet.generated.ts";

/** Model notes (hand-authored): "Legend of the Watery Grave" is legendary + watery-grave once, not twice. */
export const rubyAmulet = definePitchFamily(fabPitchFamilies["ruby-amulet"], {
  keywords: [legendary, wateryGrave],
  abilities: () => ({
    instantDestroyGainResourceResource: {
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

export const { blue: rubyAmuletBlue } = rubyAmulet.cards;
