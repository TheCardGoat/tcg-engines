import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/thunder-quake.generated.ts";
import { heave } from "../shared/keywords.ts";

export const thunderQuake = definePitchFamily(fabPitchFamilies["thunder-quake"], {
  keywords: [heave(3)],
});

export const {
  red: thunderQuakeRed,
  yellow: thunderQuakeYellow,
  blue: thunderQuakeBlue,
} = thunderQuake.cards;
