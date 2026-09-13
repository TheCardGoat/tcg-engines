import { protect } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/chivalry.generated.ts";

export const chivalry = definePitchFamily(fabPitchFamilies["chivalry"], {
  keywords: [protect],
});

export const { blue: chivalryBlue } = chivalry.cards;
