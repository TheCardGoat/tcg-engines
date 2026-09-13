import { cloaked } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/skybody-keikoi.generated.ts";

export const skybodyKeikoi = defineCard(fabCardIdentitiesByCanonicalId["rLzdPNHmqwPfmRFLhWM8R"], {
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
