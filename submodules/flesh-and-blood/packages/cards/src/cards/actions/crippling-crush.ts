import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/crippling-crush.generated.ts";
import { crushAbility, discardRandom } from "@tcg/flesh-and-blood-types";
import { crush, specialization } from "../shared/keywords.ts";
export const cripplingCrush = definePitchFamily(fabPitchFamilies["crippling-crush"], {
  keywords: [crush, specialization("Bravo")],
  abilities: () => ({
    resolve: crushAbility({
      effect: discardRandom(2),
    }),
  }),
});
export const { red: cripplingCrushRed } = cripplingCrush.cards;
