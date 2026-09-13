import { boost } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/full-tilt.generated.ts";

export const fullTilt = definePitchFamily(fabPitchFamilies["full-tilt"], {
  keywords: [boost],
});

export const { red: fullTiltRed, yellow: fullTiltYellow, blue: fullTiltBlue } = fullTilt.cards;
