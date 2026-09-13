import { crushAbility } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/disable.generated.ts";

export const disable = definePitchFamily(fabPitchFamilies["disable"], {
  abilities: () => ({
    crush: crushAbility({
      effect: {
        type: "move-card",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "attack-target",
          zones: ["arsenal"],
          count: 1,
        },
        to: {
          zone: "deck",
          position: "bottom",
        },
      },
    }),
  }),
});
export const { red: disableRed, yellow: disableYellow, blue: disableBlue } = disable.cards;
