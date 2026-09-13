import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/vantom-wraith.generated.ts";
import { bloodDebt, runeGate } from "../shared/keywords.ts";

export const vantomWraith = definePitchFamily(fabPitchFamilies["vantom-wraith"], {
  keywords: [runeGate, bloodDebt],
});

export const {
  red: vantomWraithRed,
  yellow: vantomWraithYellow,
  blue: vantomWraithBlue,
} = vantomWraith.cards;
