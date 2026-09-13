import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/wounding-blow.generated.ts";

export const woundingBlow = definePitchFamily(fabPitchFamilies["wounding-blow"], {});

export const {
  red: woundingBlowRed,
  yellow: woundingBlowYellow,
  blue: woundingBlowBlue,
} = woundingBlow.cards;
