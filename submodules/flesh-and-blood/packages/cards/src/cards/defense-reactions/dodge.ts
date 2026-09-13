import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/dodge.generated.ts";

export const dodge = definePitchFamily(fabPitchFamilies["dodge"], {});

export const { blue: dodgeBlue } = dodge.cards;
