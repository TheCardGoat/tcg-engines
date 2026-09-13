import { crushAbility } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/grind-them-down.generated.ts";

export const grindThemDown = definePitchFamily(fabPitchFamilies["grind-them-down"], {
  abilities: () => ({
    crush: crushAbility({
      effect: {
        type: "destroy",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "attack-target",
          zones: ["deck"],
          position: "top",
          count: 1,
        },
      },
    }),
  }),
});
export const {
  red: grindThemDownRed,
  yellow: grindThemDownYellow,
  blue: grindThemDownBlue,
} = grindThemDown.cards;
