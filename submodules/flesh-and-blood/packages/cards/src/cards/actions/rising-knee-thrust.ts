import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rising-knee-thrust.generated.ts";
import { comboResolution } from "@tcg/flesh-and-blood-types";
import { combo } from "../shared/keywords.ts";

export const risingKneeThrust = definePitchFamily(fabPitchFamilies["rising-knee-thrust"], {
  keywords: [combo],
  abilities: () => ({
    comboResolutionModifyNumericPowerThisTurn: comboResolution({
      names: ["Leg Tap"],
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    }),
  }),
});

export const {
  red: risingKneeThrustRed,
  yellow: risingKneeThrustYellow,
  blue: risingKneeThrustBlue,
} = risingKneeThrust.cards;
