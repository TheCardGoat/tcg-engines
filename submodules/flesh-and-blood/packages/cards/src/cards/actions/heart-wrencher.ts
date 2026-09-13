import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/heart-wrencher.generated.ts";
import { boost } from "../shared/keywords.ts";

export const heartWrencher = definePitchFamily(fabPitchFamilies["heart-wrencher"], {
  parameters: { red: {}, yellow: {}, blue: {} },
  keywords: [boost],
});

export const {
  red: heartWrencherRed,
  yellow: heartWrencherYellow,
  blue: heartWrencherBlue,
} = heartWrencher.cards;
