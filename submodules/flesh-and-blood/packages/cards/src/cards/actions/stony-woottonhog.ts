import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/stony-woottonhog.generated.ts";

export const stonyWoottonhog = definePitchFamily(fabPitchFamilies["stony-woottonhog"], {
  abilities: () => ({
    whileStaticModifyNumeric: {
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
  red: stonyWoottonhogRed,
  yellow: stonyWoottonhogYellow,
  blue: stonyWoottonhogBlue,
} = stonyWoottonhog.cards;
