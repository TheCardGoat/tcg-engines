import { crushAbility } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/flatten-the-field.generated.ts";

export const flattenTheField = definePitchFamily(fabPitchFamilies["flatten-the-field"], {
  abilities: () => ({
    crush: crushAbility({
      effect: {
        type: "destroy",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "attack-target",
          zones: ["permanent"],
          filter: {
            name: "Seismic Surge",
          },
          count: 1,
        },
      },
    }),
  }),
});
export const {
  red: flattenTheFieldRed,
  yellow: flattenTheFieldYellow,
  blue: flattenTheFieldBlue,
} = flattenTheField.cards;
