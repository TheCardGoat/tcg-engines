import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/runaways.generated.ts";

export const runaways = defineCard(fabCardIdentitiesByCanonicalId["QFg6Qh7ckkNzfhkDrJdrh"], {
  abilities: {
    instantDestroyRunawaysPreventNext1DamageWouldBe: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      condition: { type: "performed-this-turn", event: "be-dealt-damage", player: "controller" },
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: 1,
        shielded: {
          selector: "controller",
        },
        duration: "this-turn",
      },
    },
  },
});
