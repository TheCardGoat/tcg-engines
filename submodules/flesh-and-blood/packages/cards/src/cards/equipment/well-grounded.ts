import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/well-grounded.generated.ts";

export const wellGrounded = defineCard(fabCardIdentitiesByCanonicalId["zngmGjhrGpJfmnbMP87JP"], {
  abilities: {
    instantDestroyPreventNext2DamageWouldBeDealt: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      condition: {
        type: "zone-count",
        zone: "banished",
        player: "controller",
        filter: {
          typeBox: {
            supertypes: ["Earth"],
          },
        },
        comparison: {
          op: "gte",
          value: 4,
        },
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
