import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/zero-to-sixty.generated.ts";
import { boost } from "../shared/keywords.ts";

export const zeroToSixty = definePitchFamily(fabPitchFamilies["zero-to-sixty"], {
  keywords: [boost],
});

export const {
  red: zeroToSixtyRed,
  yellow: zeroToSixtyYellow,
  blue: zeroToSixtyBlue,
} = zeroToSixty.cards;
