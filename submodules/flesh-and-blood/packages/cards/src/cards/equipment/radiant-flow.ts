import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/radiant-flow.generated.ts";

export const radiantFlow = defineCard(fabCardIdentitiesByCanonicalId["GcD9dDfgTK8tmn7H8ccTk"], {
  abilities: {
    instantBanishFromHeroSSoulPreventNext2: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "effect",
            type: "banish",
            from: "arena",
            count: 1,
          },
          {
            class: "effect",
            type: "banish",
            from: "soul",
            count: 1,
          },
        ],
      },
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: 2,
        shielded: {
          selector: "controller",
        },
        duration: "this-turn",
      },
    },
  },
});
