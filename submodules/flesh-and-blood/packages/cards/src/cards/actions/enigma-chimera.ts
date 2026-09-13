import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/enigma-chimera.generated.ts";
import { phantasm } from "../shared/keywords.ts";

export const enigmaChimera = definePitchFamily(fabPitchFamilies["enigma-chimera"], {
  keywords: [phantasm],
});
export const {
  red: enigmaChimeraRed,
  yellow: enigmaChimeraYellow,
  blue: enigmaChimeraBlue,
} = enigmaChimera.cards;
