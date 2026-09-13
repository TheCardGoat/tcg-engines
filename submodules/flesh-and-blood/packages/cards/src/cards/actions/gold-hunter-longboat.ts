import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/gold-hunter-longboat.generated.ts";

export const goldHunterLongboat = definePitchFamily(fabPitchFamilies["gold-hunter-longboat"], {
  abilities: () => ({
    ifControlLessGoldThanOpponentGets2: {
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
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});
export const { yellow: goldHunterLongboatYellow } = goldHunterLongboat.cards;
