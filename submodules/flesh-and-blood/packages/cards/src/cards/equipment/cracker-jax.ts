import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/cracker-jax.generated.ts";

export const crackerJax = defineCard(fabCardIdentitiesByCanonicalId["tbc6PrGdmPnPJkbN9DW9q"], {
  abilities: {
    actionDestroyNextAttackActionPlayTurnGets1: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      layerKeywords: [goAgain],
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: nextAttackActionLatch(),
      },
    },
  },
});
