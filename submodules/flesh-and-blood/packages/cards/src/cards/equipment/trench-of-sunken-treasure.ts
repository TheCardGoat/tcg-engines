import { arcaneBarrier, bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/trench-of-sunken-treasure.generated.ts";

export const trenchOfSunkenTreasure = defineCard(
  fabCardIdentitiesByCanonicalId["rmTKDcDNJrDFRMdKrRmdH"],
  {
    keywords: [arcaneBarrier(1), bladeBreak],
    abilities: {
      oncePerTurnInstantPutFaceDownFromArsenal: {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "move-to-deck",
          from: "arsenal",
          position: "bottom",
          count: 1,
          filter: {
            hasStatus: "face-down",
          },
        },
        effect: {
          type: "gain-resources",
          amount: 1,
        },
      },
    },
  },
);
