import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rusty-harpoon.generated.ts";

export const rustyHarpoon = definePitchFamily(fabPitchFamilies["rusty-harpoon"], {});

export const { blue: rustyHarpoonBlue } = rustyHarpoon.cards;
