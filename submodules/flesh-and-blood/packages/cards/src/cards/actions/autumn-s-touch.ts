import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/autumn-s-touch.generated.ts";

export const autumnSTouch = definePitchFamily(fabPitchFamilies["autumn-s-touch"], {});

export const {
  red: autumnSTouchRed,
  yellow: autumnSTouchYellow,
  blue: autumnSTouchBlue,
} = autumnSTouch.cards;
