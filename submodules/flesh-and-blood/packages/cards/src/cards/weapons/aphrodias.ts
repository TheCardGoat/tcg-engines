import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/aphrodias.generated.ts";

export const aphrodias = defineCard(fabCardIdentitiesByCanonicalId["wQmDNJMgNTftTKBHcb9Rc"], {
  abilities: {
    instantResourceTapDeal2ArcaneDamageTargetActivateOnlyAuraHoloCounterEnteredArenaTurn: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 1,
          },
          {
            class: "effect",
            type: "tap-self",
          },
        ],
      },
      condition: { type: "performed-this-turn", event: "holo-aura-entered", player: "controller" },
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: 2,
        target: {
          selector: "any-hero",
        },
      },
    },
  },
});
