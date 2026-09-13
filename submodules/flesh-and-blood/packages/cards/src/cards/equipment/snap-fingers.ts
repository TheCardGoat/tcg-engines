import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/snap-fingers.generated.ts";

export const snapFingers = defineCard(fabCardIdentitiesByCanonicalId["9t6zhmKcwhjTK8RRGCnTz"], {
  abilities: {
    instantDestroyTargetLightningAttackActionControlActiveChain: {
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
            type: "destroy-self",
          },
        ],
      },
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: 1,
        target: {
          selector: "defending-hero",
        },
        source: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          player: "controller",
          filter: {
            typeBox: {
              supertypes: ["Lightning"],
              types: ["Action"],
              subtypes: ["Attack"],
            },
          },
          count: 1,
        },
      },
    },
  },
});
