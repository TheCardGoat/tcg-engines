import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/head-jab.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const headJab = definePitchFamily(fabPitchFamilies["head-jab"], {
  keywords: [goAgain],
});

export const { red: headJabRed, yellow: headJabYellow, blue: headJabBlue } = headJab.cards;
