import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/take-cover.generated.ts";
import { reload } from "../shared/keywords.ts";

export const takeCover = definePitchFamily(fabPitchFamilies["take-cover"], {
  keywords: [reload],
});

export const { red: takeCoverRed, yellow: takeCoverYellow, blue: takeCoverBlue } = takeCover.cards;
