import { crushAbility } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/cartilage-crush.generated.ts";

export const cartilageCrush = definePitchFamily(fabPitchFamilies["cartilage-crush"], {
  abilities: () => ({
    crush: crushAbility({
      effect: {
        type: "modify-numeric",
        property: "cost",
        op: "add",
        amount: 1,
        target: {
          selector: "attack-target",
        },
        duration: "until-end-of-their-next-turn",
        appliesTo: {
          next: {
            typeBox: {
              types: ["Action"],
            },
          },
          ordinal: 1,
        },
      },
    }),
  }),
});
export const {
  red: cartilageCrushRed,
  yellow: cartilageCrushYellow,
  blue: cartilageCrushBlue,
} = cartilageCrush.cards;
