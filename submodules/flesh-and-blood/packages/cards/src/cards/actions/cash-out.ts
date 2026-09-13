import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/cash-out.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const cashOut = definePitchFamily(fabPitchFamilies["cash-out"], {
  keywords: [goAgain],
  abilities: () => ({
    asAdditionalCostPlayCashOutMayDestroyAny: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "destroy",
          filter: {
            or: [
              {
                typeBox: {
                  types: ["Weapon"],
                },
              },
              {
                typeBox: {
                  types: ["Equipment"],
                },
              },
              {
                typeBox: {
                  subtypes: ["Item"],
                  excludeMetatypes: ["Token"],
                },
              },
            ],
          },
          count: {
            type: "any-number",
          },
        },
        optional: true,
      },
    },
    createSilverTokenEachPermanentDestroyedWay: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "silver",
        controller: "controller",
        count: {
          type: "count",
          what: "destroyed-this-way",
        },
      },
    },
  }),
});
export const { blue: cashOutBlue } = cashOut.cards;
