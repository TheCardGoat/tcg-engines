import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/cosmic-awakening.generated.ts";

export const cosmicAwakening = definePitchFamily(fabPitchFamilies["cosmic-awakening"], {
  abilities: () => ({
    if1ChiWasPitchedPlayCosmicAwakeningS: {
      kind: "static",
      staticKind: "property",
      property: "power",
      value: {
        type: "conditional",
        condition: {
          type: "compare-amount",
          amount: {
            type: "reference",
            binding: "pitched-this-way-chi-count",
            missing: "zero",
          },
          comparison: { op: "gte", value: 3 },
        },
        then: 20,
        else: {
          type: "conditional",
          condition: {
            type: "compare-amount",
            amount: {
              type: "reference",
              binding: "pitched-this-way-chi-count",
              missing: "zero",
            },
            comparison: { op: "gte", value: 2 },
          },
          then: 15,
          else: {
            type: "conditional",
            condition: {
              type: "compare-amount",
              amount: {
                type: "reference",
                binding: "pitched-this-way-chi-count",
                missing: "zero",
              },
              comparison: { op: "gte", value: 1 },
            },
            then: 10,
            else: 0,
          },
        },
      },
    },
  }),
});
export const { blue: cosmicAwakeningBlue } = cosmicAwakening.cards;
