import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/gold-hunter-ketch.generated.ts";

export const goldHunterKetch = definePitchFamily(fabPitchFamilies["gold-hunter-ketch"], {
  abilities: () => ({
    ifControlLessGoldThanOpponentCostsLessPlay: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "not",
        condition: {
          type: "zone-count",
          zone: "permanent",
          player: "controller",
          filter: {
            name: "Gold",
          },
          comparison: {
            op: "gte",
            value: {
              type: "count",
              what: "cards-in-zone",
              zone: "permanent",
              player: "opponent",
              filter: {
                name: "Gold",
              },
            },
          },
        },
      },
      playEffect: {
        role: "cost-reduction",
        cost: {
          class: "asset",
          type: "resources",
          amount: 2,
        },
      },
    },
  }),
});
export const { yellow: goldHunterKetchYellow } = goldHunterKetch.cards;
