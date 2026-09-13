import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/talisman-of-dousing.generated.ts";
import { goAgain, spellvoid } from "../shared/keywords.ts";

export const talismanOfDousing = definePitchFamily(fabPitchFamilies["talisman-of-dousing"], {
  keywords: [goAgain, spellvoid(1)],
});

export const { yellow: talismanOfDousingYellow } = talismanOfDousing.cards;
