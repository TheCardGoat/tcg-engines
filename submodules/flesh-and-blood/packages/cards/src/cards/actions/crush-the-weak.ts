import { attackActionFilter, crushAbility } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/crush-the-weak.generated.ts";

export const crushTheWeak = definePitchFamily(fabPitchFamilies["crush-the-weak"], {
  abilities: () => ({
    crush: crushAbility({
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "play",
        filter: attackActionFilter({
          power: {
            op: "lte",
            value: 3,
          },
        }),
        duration: "until-end-of-next-turn",
      },
    }),
  }),
});
export const {
  red: crushTheWeakRed,
  yellow: crushTheWeakYellow,
  blue: crushTheWeakBlue,
} = crushTheWeak.cards;
