import { bloodDebt, dominate } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/writhing-beast-hulk.generated.ts";

export const writhingBeastHulk = definePitchFamily(fabPitchFamilies["writhing-beast-hulk"], {
  keywords: [bloodDebt],

  abilities: () => ({
    banishTopCardAsAdditionalCost: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "banish",
          from: "graveyard",
          count: 3,
          random: true,
        },
      },
    },
    gainDominateIfSixPowerCardBanished: {
      kind: "resolution",
      condition: {
        type: "compare-amount",
        amount: {
          type: "count",
          what: "banished-this-way",
          filter: { power: { op: "gte", value: 6 } },
        },
        comparison: { op: "gte", value: 1 },
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: dominate,
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
  red: writhingBeastHulkRed,
  yellow: writhingBeastHulkYellow,
  blue: writhingBeastHulkBlue,
} = writhingBeastHulk.cards;
