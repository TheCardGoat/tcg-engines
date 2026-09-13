import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/leg-tap.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const legTap = definePitchFamily(fabPitchFamilies["leg-tap"], {
  keywords: [goAgain],
});

export const { red: legTapRed, yellow: legTapYellow, blue: legTapBlue } = legTap.cards;
