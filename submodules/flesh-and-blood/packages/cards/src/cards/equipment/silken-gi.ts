import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/silken-gi.generated.ts";

export const silkenGi = defineCard(fabCardIdentitiesByCanonicalId["PpF7WhbMCTMBrK9cLtPmR"], {
  abilities: {
    instantDestroySilkenGiNextAttackActionPlayTurn: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "subtract",
            amount: 1,
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: nextAttackActionLatch(),
          },
          {
            type: "modify-numeric",
            property: "cost",
            op: "subtract",
            amount: 1,
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: nextAttackActionLatch(),
          },
        ],
      },
    },
  },
});
