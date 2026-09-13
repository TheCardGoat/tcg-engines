import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/events/fight-night-prize-purse.generated.ts";

export const fightNightPrizePurse = defineCard(
  fabCardIdentitiesByCanonicalId.TMKn79cNDqQp6PJGGrBqj,
  {
    abilities: {
      shareGoldWithOpponent: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "choose-opponent",
            },
            {
              type: "create-token",
              token: "gold",
              controller: "each",
            },
          ],
        },
      },
    },
  },
);
