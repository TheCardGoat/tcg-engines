import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/erode-authority.generated.ts";
import { dominate, fragment } from "../shared/keywords.ts";

export const erodeAuthority = definePitchFamily(fabPitchFamilies["erode-authority"], {
  keywords: [dominate, fragment],
});
export const {
  red: erodeAuthorityRed,
  yellow: erodeAuthorityYellow,
  blue: erodeAuthorityBlue,
} = erodeAuthority.cards;
