import { boost } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/gas-guzzler.generated.ts";

export const gasGuzzler = definePitchFamily(fabPitchFamilies["gas-guzzler"], {
  keywords: [boost],
});

export const {
  red: gasGuzzlerRed,
  yellow: gasGuzzlerYellow,
  blue: gasGuzzlerBlue,
} = gasGuzzler.cards;
