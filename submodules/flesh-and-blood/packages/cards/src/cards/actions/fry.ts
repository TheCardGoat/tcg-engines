import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/fry.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const fry = definePitchFamily(fabPitchFamilies["fry"], {
  keywords: [goAgain],
});
export const { red: fryRed, yellow: fryYellow, blue: fryBlue } = fry.cards;
