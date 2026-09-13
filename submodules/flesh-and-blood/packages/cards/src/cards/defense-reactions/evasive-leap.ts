import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/evasive-leap.generated.ts";

export const evasiveLeap = definePitchFamily(fabPitchFamilies["evasive-leap"], {});

export const {
  red: evasiveLeapRed,
  yellow: evasiveLeapYellow,
  blue: evasiveLeapBlue,
} = evasiveLeap.cards;
