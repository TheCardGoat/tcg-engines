import { nextAttackPowerWithOnHit } from "../../authoring/attack-patterns.ts";
import { battleworn, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/undead-grasp.generated.ts";

export const undeadGrasp = defineCard(fabCardIdentitiesByCanonicalId["mpJLbHkrWkkqqpGCRg8qF"], {
  keywords: [battleworn],
  abilities: {
    actionDiscardZombieDestroyNextZombieAttackTurnGets: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          { class: "asset", type: "resources", amount: 1 },
          {
            class: "effect",
            type: "discard",
            count: 1,
            filter: { typeBox: { subtypes: ["Zombie"] } },
          },
          { class: "effect", type: "destroy-self" },
        ],
      },
      layerKeywords: [goAgain],
      effect: nextAttackPowerWithOnHit({
        amount: 3,
        filter: { typeBox: { subtypes: ["Zombie"] } },
        effect: { type: "destroy", target: { selector: "self" } },
      }),
    },
  },
});
