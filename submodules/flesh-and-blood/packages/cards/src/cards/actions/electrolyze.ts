import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/electrolyze.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const electrolyze = definePitchFamily(fabPitchFamilies["electrolyze"], {
  keywords: [goAgain],
});
export const {
  red: electrolyzeRed,
  yellow: electrolyzeYellow,
  blue: electrolyzeBlue,
} = electrolyze.cards;
