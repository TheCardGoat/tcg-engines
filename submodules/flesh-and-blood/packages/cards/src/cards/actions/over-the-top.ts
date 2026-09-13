import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/over-the-top.generated.ts";
import { overpower } from "../shared/keywords.ts";

export const overTheTop = definePitchFamily(fabPitchFamilies["over-the-top"], {
  abilities: () => ({
    objectNumericComparisonPowerGrantPropertyThisTurn: {
      kind: "resolution",
      condition: {
        type: "object-numeric-comparison",
        property: "power",
        left: "current",
        op: "gt",
        right: "base",
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
export const {
  red: overTheTopRed,
  yellow: overTheTopYellow,
  blue: overTheTopBlue,
} = overTheTop.cards;
