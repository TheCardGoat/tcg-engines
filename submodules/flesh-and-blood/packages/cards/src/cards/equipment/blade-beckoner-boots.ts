import { guardwell } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/blade-beckoner-boots.generated.ts";

export const bladeBeckonerBoots = defineCard(
  fabCardIdentitiesByCanonicalId["N7WzjJdqrn8NTh6f8rDb9"],
  {
    keywords: [guardwell],
    abilities: {
      gets1WhileDefendingWeaponAttack: {
        kind: "static",
        staticKind: "continuous",
        condition: {
          type: "has-status",
          status: "defending-a-weapon-attack",
        },
        effect: {
          type: "modify-numeric",
          property: "defense",
          op: "add",
          amount: 1,
          target: {
            selector: "self",
          },
          duration: "permanent",
        },
      },
    },
  },
);
