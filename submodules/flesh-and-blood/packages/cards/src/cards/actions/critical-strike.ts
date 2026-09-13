import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/critical-strike.generated.ts";

export const criticalStrike = definePitchFamily(fabPitchFamilies["critical-strike"], {});

export const {
  red: criticalStrikeRed,
  yellow: criticalStrikeYellow,
  blue: criticalStrikeBlue,
} = criticalStrike.cards;
