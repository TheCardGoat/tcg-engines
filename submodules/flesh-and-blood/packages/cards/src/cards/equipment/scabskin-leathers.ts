import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/scabskin-leathers.generated.ts";

export const scabskinLeathers = defineCard(
  fabCardIdentitiesByCanonicalId["nkCCKCB8ftPdMCHHWHWtk"],
  {
    keywords: [battleworn],
    abilities: {
      oncePerTurnAction0Roll6SidedDie: {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "action",
        cost: {
          class: "asset",
          type: "resources",
          amount: 0,
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "roll",
              sides: 6,
            },
            {
              type: "gain-action-points",
              amount: {
                type: "roll-result",
                divisor: 2,
                rounding: "down",
              },
            },
          ],
        },
      },
    },
  },
);
