import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/raging-onslaught.generated.ts";

export const ragingOnslaught = definePitchFamily(fabPitchFamilies["raging-onslaught"], {});

export const {
  red: ragingOnslaughtRed,
  yellow: ragingOnslaughtYellow,
  blue: ragingOnslaughtBlue,
} = ragingOnslaught.cards;
