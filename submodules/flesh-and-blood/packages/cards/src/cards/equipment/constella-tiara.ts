import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/constella-tiara.generated.ts";

export const constellaTiara = defineCard(fabCardIdentitiesByCanonicalId["CwhpPfrRGmdGNkjR6Fg8G"], {
  abilities: {
    instantDestroyPreventNext1DamageWouldBeDealt: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 2,
          },
          {
            class: "effect",
            type: "destroy-self",
          },
        ],
      },
      // Printed "If you prevent damage this way, create a Ponder token"
      // is additionalModification — it fires only when prevention reduces damage.
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: 1,
        shielded: {
          selector: "controller",
        },
        duration: "this-turn",
        additionalModification: {
          type: "create-token",
          token: "ponder",
          controller: "controller",
        },
      },
    },
  },
});
