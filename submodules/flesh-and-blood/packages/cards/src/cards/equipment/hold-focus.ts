import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/hold-focus.generated.ts";

export const holdFocus = defineCard(fabCardIdentitiesByCanonicalId["mTWd9JgNqM9bGj9H87Jpq"], {
  abilities: {
    actionDestroyAmp1GoAgain: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      layerKeywords: [goAgain],
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "damage",
          damageType: "arcane",
        },
        modification: {
          type: "modify-numeric",
          property: "count",
          op: "add",
          amount: 1,
          target: {
            selector: "self",
          },
          duration: "permanent",
        },
        duration: "this-turn",
      },
    },
  },
});
