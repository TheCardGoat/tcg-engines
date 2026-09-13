import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/out-muscle.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const outMuscle = definePitchFamily(fabPitchFamilies["out-muscle"], {
  abilities: () => ({
    whileNotHasStatusDefendedByCardWithEqualOrGreaterPowerGrantPropertyPermanent: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "not",
        condition: {
          type: "has-status",
          status: "defended-by-card-with-equal-or-greater-power",
        },
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
  }),
});

export const { red: outMuscleRed, yellow: outMuscleYellow, blue: outMuscleBlue } = outMuscle.cards;
