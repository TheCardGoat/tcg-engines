import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/bone-basher.generated.ts";

export const boneBasher = defineCard(fabCardIdentitiesByCanonicalId["LCbjKjHJJd8JJDNWrd6CC"], {
  abilities: {
    oncePerTurnActionResourceResourceAttack: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "attack",
      cost: {
        class: "asset",
        type: "resources",
        amount: 2,
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
  },
});
