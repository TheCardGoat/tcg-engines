import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/mask-of-three-tails.generated.ts";

export const maskOfThreeTails = defineCard(
  fabCardIdentitiesByCanonicalId["pdCLkLqDkmFhBtp7MFMfP"],
  {
    abilities: {
      instantDestroyDrawActivateAbilityOnlyIfVeHit: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        condition: {
          type: "compare-amount",
          amount: { type: "count", what: "combat-chain-hits" },
          comparison: { op: "gte", value: 3 },
        },
        effect: {
          type: "draw",
          count: 1,
          player: "controller",
        },
      },
    },
  },
);
