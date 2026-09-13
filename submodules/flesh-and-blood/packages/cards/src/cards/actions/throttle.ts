import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/throttle.generated.ts";
import { boost } from "../shared/keywords.ts";

export const throttle = definePitchFamily(fabPitchFamilies["throttle"], {
  keywords: [boost],
});

export const { red: throttleRed, yellow: throttleYellow, blue: throttleBlue } = throttle.cards;
