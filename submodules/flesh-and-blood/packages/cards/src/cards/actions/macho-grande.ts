import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/macho-grande.generated.ts";
import { dominate } from "../shared/keywords.ts";

export const machoGrande = definePitchFamily(fabPitchFamilies["macho-grande"], {
  keywords: [dominate],
});
export const {
  red: machoGrandeRed,
  yellow: machoGrandeYellow,
  blue: machoGrandeBlue,
} = machoGrande.cards;
