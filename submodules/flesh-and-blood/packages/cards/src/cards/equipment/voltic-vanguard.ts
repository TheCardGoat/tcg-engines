import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/voltic-vanguard.generated.ts";

export const volticVanguard = defineCard(fabCardIdentitiesByCanonicalId["WKpW6KJR9RhPrTwj6Gwcw"], {
  abilities: {
    instantDestroyPreventNext2DamageWouldBeDealt: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      condition: {
        type: "played-this",
        per: "turn",
        filter: {
          typeBox: {
            types: ["Instant"],
          },
        },
        comparison: {
          op: "gte",
          value: 1,
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
