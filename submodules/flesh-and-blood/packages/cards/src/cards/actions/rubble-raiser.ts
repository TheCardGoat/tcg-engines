import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rubble-raiser.generated.ts";
import { heave } from "../shared/keywords.ts";

export const rubbleRaiser = definePitchFamily(fabPitchFamilies["rubble-raiser"], {
  keywords: [heave(2)],
});

export const {
  red: rubbleRaiserRed,
  yellow: rubbleRaiserYellow,
  blue: rubbleRaiserBlue,
} = rubbleRaiser.cards;
