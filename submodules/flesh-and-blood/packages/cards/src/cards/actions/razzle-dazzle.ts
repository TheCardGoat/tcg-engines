import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/razzle-dazzle.generated.ts";
import { boost } from "../shared/keywords.ts";

export const razzleDazzle = definePitchFamily(fabPitchFamilies["razzle-dazzle"], {
  keywords: [boost],
});

export const {
  red: razzleDazzleRed,
  yellow: razzleDazzleYellow,
  blue: razzleDazzleBlue,
} = razzleDazzle.cards;
