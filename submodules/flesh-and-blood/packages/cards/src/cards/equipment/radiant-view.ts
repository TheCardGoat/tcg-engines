import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/radiant-view.generated.ts";

export const radiantView = defineCard(fabCardIdentitiesByCanonicalId["mMbkbwz6rkpPTLcjthNJT"], {
  abilities: {
    instantBanishFromHeroSSoulPreventNext2: {
      kind: "activated",
      abilityType: "instant",
      // "Banish this" is banish-self (not banish any permanent in arena).
      // Plus banish one soul card as a second cost.
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "effect",
            type: "banish-self",
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
