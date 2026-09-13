import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/hundred-winds.generated.ts";
import { comboStatic } from "@tcg/flesh-and-blood-types";
import { combo, goAgain } from "../shared/keywords.ts";

export const hundredWinds = definePitchFamily(fabPitchFamilies["hundred-winds"], {
  keywords: [goAgain, combo],
  abilities: () => ({
    comboStaticModifyNumericPowerCountHundredWindsPermanent: comboStatic({
      names: ["Hundred Winds"],
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: {
          type: "count",
          what: "cards-in-zone",
          zone: "combat-chain",
          player: "controller",
          filter: {
            name: "Hundred Winds",
            hasStatus: "other-than-source",
          },
        },
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    }),
  }),
});

export const {
  red: hundredWindsRed,
  yellow: hundredWindsYellow,
  blue: hundredWindsBlue,
} = hundredWinds.cards;
