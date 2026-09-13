import { crushAbility } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/boulder-drop.generated.ts";

export const boulderDrop = definePitchFamily(fabPitchFamilies["boulder-drop"], {
  abilities: () => ({
    crush: crushAbility({
      effect: {
        type: "move-card",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "attack-target",
          zones: ["hand"],
          count: 1,
        },
        to: {
          zone: "deck",
          position: "top",
        },
      },
    }),
  }),
});
export const {
  red: boulderDropRed,
  yellow: boulderDropYellow,
  blue: boulderDropBlue,
} = boulderDrop.cards;
