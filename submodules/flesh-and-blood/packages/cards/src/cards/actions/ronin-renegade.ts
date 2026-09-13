import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/ronin-renegade.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const roninRenegade = definePitchFamily(fabPitchFamilies["ronin-renegade"], {
  keywords: [goAgain],
});

export const {
  red: roninRenegadeRed,
  yellow: roninRenegadeYellow,
  blue: roninRenegadeBlue,
} = roninRenegade.cards;
