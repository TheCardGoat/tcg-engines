import { cloaked } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/skywalker-keikoi.generated.ts";

export const skywalkerKeikoi = defineCard(fabCardIdentitiesByCanonicalId["Rn7bzNz8BdmwrcTBkMHM6"], {
  keywords: [cloaked],
  abilities: {
    instantDestroyPreventNext1DamageWouldBeDealt: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      condition: {
        type: "has-status",
        status: "face-down",
      },
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
