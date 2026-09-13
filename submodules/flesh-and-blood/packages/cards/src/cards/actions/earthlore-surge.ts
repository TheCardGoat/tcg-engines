import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/earthlore-surge.generated.ts";

export const earthloreSurge = definePitchFamily(fabPitchFamilies["earthlore-surge"], {
  keywords: [goAgain],

  abilities: () => ({
    modifyNumericPower: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 5,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: nextAttackActionLatch(),
      },
    },
  }),
});
export const {
  red: earthloreSurgeRed,
  yellow: earthloreSurgeYellow,
  blue: earthloreSurgeBlue,
} = earthloreSurge.cards;
