import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/dash.generated.ts";

export const dash = defineCard(fabCardIdentitiesByCanonicalId["kftPnNkrBLJ7rPmFGgQCm"], {
  abilities: {
    startGameMechanologistItemCost2LessArena: {
      kind: "static",
      staticKind: "meta",
      effect: {
        type: "start-game",
        setup: "place",
        filter: {
          and: [
            {
              typeBox: {
                supertypes: ["Mechanologist"],
              },
            },
            {
              typeBox: {
                subtypes: ["Item"],
              },
            },
          ],
          cost: {
            op: "lte",
            value: 2,
          },
        },
        to: {
          zone: "permanent",
        },
        optional: true,
      },
    },
  },
});
