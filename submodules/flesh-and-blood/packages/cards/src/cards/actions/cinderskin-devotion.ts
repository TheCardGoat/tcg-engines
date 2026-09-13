import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/cinderskin-devotion.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const cinderskinDevotion = definePitchFamily(fabPitchFamilies["cinderskin-devotion"], {
  abilities: () => ({
    resolutionCompareAmountGrantProperty: {
      kind: "resolution",
      condition: {
        type: "compare-amount",
        amount: {
          type: "count",
          what: "chain-links",
          player: "controller",
          filter: { typeBox: { supertypes: ["Draconic"] } },
        },
        comparison: { op: "gte", value: 2 },
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const {
  red: cinderskinDevotionRed,
  yellow: cinderskinDevotionYellow,
  blue: cinderskinDevotionBlue,
} = cinderskinDevotion.cards;
