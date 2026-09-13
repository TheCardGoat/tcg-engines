import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/aether-conduit.generated.ts";

export const aetherConduit = defineCard(fabCardIdentitiesByCanonicalId["HFnfqgNGj6JdDwMjDC7KQ"], {
  abilities: {
    oncePerTurnActionResourceResourceDeal2ArcaneDamageTarget: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "action",
      cost: {
        class: "asset",
        type: "resources",
        amount: 2,
      },
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: 2,
        target: {
          selector: "any-hero",
        },
      },
    },
  },
});
