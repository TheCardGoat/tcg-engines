import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/events/hit-the-jackpot.generated.ts";

export const hitTheJackpot = defineCard(fabCardIdentitiesByCanonicalId.CDPJ7MNMhpFCmpRn79TP7, {
  abilities: {
    createGold: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "create-token",
        token: "gold",
        controller: "controller",
      },
    },
    drawForGold: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "draw",
        count: {
          type: "count",
          what: "cards-in-zone",
          zone: "permanent",
          player: "controller",
          filter: {
            name: "Gold",
          },
        },
        player: "controller",
      },
    },
  },
});
