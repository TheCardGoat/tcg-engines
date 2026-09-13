import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/macros/sanctuary-of-aria.generated.ts";

export const sanctuaryOfAria = defineCard(fabCardIdentitiesByCanonicalId.bMJBmMJt99tBDWrznqMBR, {
  abilities: {
    preventDamage: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "asset",
        type: "resources",
        amount: 2,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "prevention",
            preventionKind: "fixed",
            amount: 1,
            shielded: {
              selector: "controller",
            },
            duration: "this-turn",
          },
          {
            type: "destroy",
            target: {
              selector: "self",
            },
            delay: "end-phase",
          },
        ],
      },
    },
  },
});
