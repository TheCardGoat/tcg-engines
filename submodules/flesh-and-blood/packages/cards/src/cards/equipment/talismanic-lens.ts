import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/talismanic-lens.generated.ts";

export const talismanicLens = defineCard(fabCardIdentitiesByCanonicalId["JTNgbmMDfnz69RKFpjrrR"], {
  abilities: {
    instantDestroyTalismanicLensOpt2: {
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
  },
});
