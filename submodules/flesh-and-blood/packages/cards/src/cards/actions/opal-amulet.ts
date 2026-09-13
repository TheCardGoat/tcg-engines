import { legendary, wateryGrave } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/opal-amulet.generated.ts";

export const opalAmulet = definePitchFamily(fabPitchFamilies["opal-amulet"], {
  keywords: [legendary, wateryGrave],
  abilities: () => ({
    instantDestroyOpt2: {
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

export const { blue: opalAmuletBlue } = opalAmulet.cards;
