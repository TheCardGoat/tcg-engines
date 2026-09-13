import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/zero-to-fifty.generated.ts";
import { boost } from "../shared/keywords.ts";

export const zeroToFifty = definePitchFamily(fabPitchFamilies["zero-to-fifty"], {
  keywords: [boost],
});

export const {
  red: zeroToFiftyRed,
  yellow: zeroToFiftyYellow,
  blue: zeroToFiftyBlue,
} = zeroToFifty.cards;
