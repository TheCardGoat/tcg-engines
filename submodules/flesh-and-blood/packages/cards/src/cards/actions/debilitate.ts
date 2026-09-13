import { crushAbility } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/debilitate.generated.ts";

export const debilitate = definePitchFamily(fabPitchFamilies["debilitate"], {
  abilities: () => ({
    crush: crushAbility({
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "subtract",
        amount: 2,
        target: {
          selector: "attack-target",
        },
        duration: "until-end-of-their-next-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Attack"],
            },
          },
          ordinal: 1,
        },
      },
    }),
  }),
});
export const {
  red: debilitateRed,
  yellow: debilitateYellow,
  blue: debilitateBlue,
} = debilitate.cards;
