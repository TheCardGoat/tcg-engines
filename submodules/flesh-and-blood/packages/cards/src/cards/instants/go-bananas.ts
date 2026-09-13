import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/go-bananas.generated.ts";

export const goBananas = definePitchFamily(fabPitchFamilies["go-bananas"], {});

export const { yellow: goBananasYellow } = goBananas.cards;
