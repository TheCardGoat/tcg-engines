import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/barraging-brawnhide.generated.ts";

export const barragingBrawnhide = definePitchFamily(fabPitchFamilies["barraging-brawnhide"], {
  abilities: () => ({
    whileModifyNumericPower: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "has-status",
        status: "defended-by-fewer-than-2-non-equipment-cards",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
  }),
});
export const {
  red: barragingBrawnhideRed,
  yellow: barragingBrawnhideYellow,
  blue: barragingBrawnhideBlue,
} = barragingBrawnhide.cards;
