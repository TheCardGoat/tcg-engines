import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/zipper-hit.generated.ts";
import { boost } from "../shared/keywords.ts";

export const zipperHit = definePitchFamily(fabPitchFamilies["zipper-hit"], {
  keywords: [boost],
});

export const { red: zipperHitRed, yellow: zipperHitYellow, blue: zipperHitBlue } = zipperHit.cards;
