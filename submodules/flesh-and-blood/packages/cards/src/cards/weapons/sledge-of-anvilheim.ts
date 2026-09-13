import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/sledge-of-anvilheim.generated.ts";

export const sledgeOfAnvilheim = defineCard(
  fabCardIdentitiesByCanonicalId["TGJ8mNQ6DnfnLqzH7WMFg"],
  {
    abilities: {
      actionResourceResourceResourceResourceAttack: {
        kind: "activated",
        abilityType: "attack",
        cost: {
          class: "asset",
          type: "resources",
          amount: 4,
        },
        effect: {
          type: "attack-with",
          target: {
            selector: "self",
          },
        },
      },
    },
  },
);
