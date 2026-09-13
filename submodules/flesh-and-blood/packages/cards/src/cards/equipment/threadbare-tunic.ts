import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/threadbare-tunic.generated.ts";

export const threadbareTunic = defineCard(fabCardIdentitiesByCanonicalId["ggGjPCWdGwktGGF8gjbDc"], {
  abilities: {
    instantDestroyThreadbareTunicGainActivateAbilityOnlyIf: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      condition: {
        type: "zone-count",
        zone: "hand",
        player: "controller",
        comparison: {
          op: "eq",
          value: 0,
        },
      },
      effect: {
        type: "gain-resources",
        amount: 1,
      },
    },
  },
});
