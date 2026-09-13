import { guardwell } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/blade-beckoner-gauntlets.generated.ts";

export const bladeBeckonerGauntlets = defineCard(
  fabCardIdentitiesByCanonicalId["BtThQJzWQFwCfzfHWbjdJ"],
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
