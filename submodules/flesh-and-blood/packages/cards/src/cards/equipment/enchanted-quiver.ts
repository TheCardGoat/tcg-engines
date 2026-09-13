import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/enchanted-quiver.generated.ts";

export const enchantedQuiver = defineCard(fabCardIdentitiesByCanonicalId["CWPHzh8wWpWNgwmQWgt7C"], {
  abilities: {
    instantDestroyPreventNext1ArcaneDamageWouldBe: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      // Printed "instead": single conditional with then/else amount (PEN043
      // pattern). Sequence + instead:true was ignored by the proposal layer
      // (both preventions would register and ask the player to order them).
      effect: {
        type: "conditional",
        condition: {
          type: "zone-count",
          zone: "arsenal",
          player: "controller",
          filter: {
            typeBox: {
              subtypes: ["Arrow"],
            },
            hasStatus: "face-up",
          },
          comparison: {
            op: "gte",
            value: 1,
          },
        },
        then: {
          type: "prevention",
          preventionKind: "fixed",
          amount: 2,
          damageType: "arcane",
          shielded: {
            selector: "controller",
          },
          duration: "this-turn",
        },
        else: {
          type: "prevention",
          preventionKind: "fixed",
          amount: 1,
          damageType: "arcane",
          shielded: {
            selector: "controller",
          },
          duration: "this-turn",
        },
      },
    },
  },
});
