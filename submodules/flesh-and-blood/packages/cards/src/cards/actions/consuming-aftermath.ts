import { dominate } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/consuming-aftermath.generated.ts";
export const consumingAftermath = definePitchFamily(fabPitchFamilies["consuming-aftermath"], {
  abilities: () => ({
    staticPlay: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "banish",
          from: "hand",
          count: 1,
          filter: {},
        },
        optional: true,
      },
    },
    resolutionCompareAmountGrantProperty: {
      kind: "resolution",
      condition: {
        type: "compare-amount",
        amount: {
          type: "count",
          what: "banished-this-way",
          filter: { typeBox: { supertypes: ["Shadow"] } },
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
  red: consumingAftermathRed,
  yellow: consumingAftermathYellow,
  blue: consumingAftermathBlue,
} = consumingAftermath.cards;
