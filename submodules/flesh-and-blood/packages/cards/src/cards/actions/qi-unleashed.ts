import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/qi-unleashed.generated.ts";
import { comboResolution } from "@tcg/flesh-and-blood-types";
import { combo } from "../shared/keywords.ts";

export const qiUnleashed = definePitchFamily(fabPitchFamilies["qi-unleashed"], {
  keywords: [combo],
  abilities: () => ({
    comboResolutionModifyNumericPowerThisTurn: comboResolution({
      names: ["Crouching Tiger"],
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 4,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    }),
  }),
});

export const {
  red: qiUnleashedRed,
  yellow: qiUnleashedYellow,
  blue: qiUnleashedBlue,
} = qiUnleashed.cards;
