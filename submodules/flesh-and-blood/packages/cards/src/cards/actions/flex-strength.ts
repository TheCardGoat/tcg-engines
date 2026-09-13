import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/flex-strength.generated.ts";
export const flexStrength = definePitchFamily(fabPitchFamilies["flex-strength"], {
  abilities: () => ({
    resolutionCompareAmountModifyNumericPower: {
      kind: "resolution",
      condition: {
        type: "compare-amount",
        amount: {
          type: "subject-property",
          property: "power",
          basis: "current",
          missing: "zero",
        },
        comparison: { op: "gte", value: 6 },
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
  red: flexStrengthRed,
  yellow: flexStrengthYellow,
  blue: flexStrengthBlue,
} = flexStrength.cards;
