import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/constella-waves.generated.ts";

export const constellaWaves = defineCard(fabCardIdentitiesByCanonicalId["hFfmQg8Rc6gttfrhzpcPh"], {
  abilities: {
    instantHeroDestroyAmp1: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "effect",
            type: "tap-hero",
          },
          {
            class: "effect",
            type: "destroy-self",
          },
        ],
      },
      effect: {
        type: "amp",
        amount: 1,
      },
    },
  },
});
