import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/old-knocker.generated.ts";

export const oldKnocker = defineCard(fabCardIdentitiesByCanonicalId["KTh89nLtmJWQcQQJPwgDW"], {
  keywords: [bladeBreak],
  abilities: {
    instantHeroDestroyGain: {
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
        type: "gain-resources",
        amount: 1,
      },
    },
  },
});
