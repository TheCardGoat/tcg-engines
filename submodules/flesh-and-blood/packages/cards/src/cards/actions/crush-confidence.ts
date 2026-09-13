import { crushAbility } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/crush-confidence.generated.ts";

export const crushConfidence = definePitchFamily(fabPitchFamilies["crush-confidence"], {
  abilities: () => ({
    crush: crushAbility({
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "lose-abilities",
        filter: {
          typeBox: {
            types: ["Hero"],
          },
        },
        subject: {
          selector: "attack-target",
        },
        duration: "until-end-of-their-next-turn",
      },
    }),
  }),
});
export const {
  red: crushConfidenceRed,
  yellow: crushConfidenceYellow,
  blue: crushConfidenceBlue,
} = crushConfidence.cards;
