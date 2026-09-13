import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/bloodied-boots.generated.ts";

export const bloodiedBoots = defineCard(fabCardIdentitiesByCanonicalId["G7PgmckBqgBGmPgFbCnDP"], {
  abilities: {
    mayEquip: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "optional",
        effect: {
          type: "equip",
          target: {
            selector: "self",
          },
        },
      },
    },
    actionDestroyGain2ActionPoints: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "gain-action-points",
        amount: 2,
      },
    },
  },
});
