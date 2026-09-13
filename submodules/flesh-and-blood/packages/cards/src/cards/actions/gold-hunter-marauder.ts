import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/gold-hunter-marauder.generated.ts";

import { overpower } from "../shared/keywords.ts";

export const goldHunterMarauder = definePitchFamily(fabPitchFamilies["gold-hunter-marauder"], {
  abilities: () => ({
    ifControlLessGoldThanOpponentGetsOverpower: {
      kind: "resolution",
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
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: overpower,
        },
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});
export const { yellow: goldHunterMarauderYellow } = goldHunterMarauder.cards;
