import { arcaneBarrier } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/spellfire-cloak.generated.ts";

export const spellfireCloak = defineCard(fabCardIdentitiesByCanonicalId["7hLHLm8qkPm6fjhHnqdWd"], {
  keywords: [arcaneBarrier(1)],
  abilities: {
    instantDestroySpellfireCloakGainActivateAbilityOnlyDuring: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      condition: {
        type: "has-status",
        status: "not-your-turn",
      },
      effect: {
        type: "gain-resources",
        amount: 1,
      },
    },
  },
});
