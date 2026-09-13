import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/muscle-mutt.generated.ts";

export const muscleMutt = definePitchFamily(fabPitchFamilies["muscle-mutt"], {});

export const { yellow: muscleMuttYellow } = muscleMutt.cards;
