import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/vantom-banshee.generated.ts";
import { bloodDebt, runeGate } from "../shared/keywords.ts";

export const vantomBanshee = definePitchFamily(fabPitchFamilies["vantom-banshee"], {
  keywords: [runeGate, bloodDebt],
});

export const {
  red: vantomBansheeRed,
  yellow: vantomBansheeYellow,
  blue: vantomBansheeBlue,
} = vantomBanshee.cards;
