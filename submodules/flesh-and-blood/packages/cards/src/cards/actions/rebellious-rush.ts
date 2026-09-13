import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rebellious-rush.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const rebelliousRush = definePitchFamily(fabPitchFamilies["rebellious-rush"], {
  keywords: [goAgain],
});

export const {
  red: rebelliousRushRed,
  yellow: rebelliousRushYellow,
  blue: rebelliousRushBlue,
} = rebelliousRush.cards;
