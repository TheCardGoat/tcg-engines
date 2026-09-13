import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pouncing-qi.generated.ts";
import { comboStatic } from "@tcg/flesh-and-blood-types";
import { combo, goAgain } from "../shared/keywords.ts";

export const pouncingQi = definePitchFamily(fabPitchFamilies["pouncing-qi"], {
  keywords: [goAgain, combo],
  abilities: () => ({
    comboStaticSequenceModifyNumericPowerPermanentGrantPropertyPermanent: comboStatic({
      names: ["Crouching Tiger"],
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
          {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: goAgain,
            },
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
        ],
      },
    }),
  }),
});

export const {
  red: pouncingQiRed,
  yellow: pouncingQiYellow,
  blue: pouncingQiBlue,
} = pouncingQi.cards;
