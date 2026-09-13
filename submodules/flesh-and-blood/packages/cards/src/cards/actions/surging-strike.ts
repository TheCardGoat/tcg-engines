import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/surging-strike.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const surgingStrike = definePitchFamily(fabPitchFamilies["surging-strike"], {
  keywords: [goAgain],
});

export const {
  red: surgingStrikeRed,
  yellow: surgingStrikeYellow,
  blue: surgingStrikeBlue,
} = surgingStrike.cards;
