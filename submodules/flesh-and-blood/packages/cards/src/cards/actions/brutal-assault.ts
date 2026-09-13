import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/brutal-assault.generated.ts";

export const brutalAssault = definePitchFamily(fabPitchFamilies["brutal-assault"], {});

export const {
  red: brutalAssaultRed,
  yellow: brutalAssaultYellow,
  blue: brutalAssaultBlue,
} = brutalAssault.cards;
