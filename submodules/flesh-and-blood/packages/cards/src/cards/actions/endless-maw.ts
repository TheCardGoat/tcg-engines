import { bloodDebt } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/endless-maw.generated.ts";

export const endlessMaw = definePitchFamily(fabPitchFamilies["endless-maw"], {
  keywords: [bloodDebt],

  abilities: () => ({
    additionalCostBanish: {
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
    modifyNumericPower: {
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
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});
export const {
  red: endlessMawRed,
  yellow: endlessMawYellow,
  blue: endlessMawBlue,
} = endlessMaw.cards;
