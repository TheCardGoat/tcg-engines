import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/toughen-up.generated.ts";

export const toughenUp = definePitchFamily(fabPitchFamilies["toughen-up"], {});

export const { blue: toughenUpBlue } = toughenUp.cards;
