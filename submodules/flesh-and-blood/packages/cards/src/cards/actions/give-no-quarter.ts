import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/give-no-quarter.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const giveNoQuarter = definePitchFamily(fabPitchFamilies["give-no-quarter"], {
  keywords: [goAgain],
  abilities: () => ({
    next2AllyWateryGravePlayTurnCostLess: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "cost",
        op: "subtract",
        amount: 3,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Ally"],
            },
            hasKeyword: "watery-grave",
          },
          count: 2,
        },
      },
    },
  }),
});
export const { blue: giveNoQuarterBlue } = giveNoQuarter.cards;
