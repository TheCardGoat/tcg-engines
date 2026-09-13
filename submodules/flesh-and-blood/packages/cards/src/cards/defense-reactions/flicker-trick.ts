import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/flicker-trick.generated.ts";
import { mirage } from "../shared/keywords.ts";

export const flickerTrick = definePitchFamily(fabPitchFamilies["flicker-trick"], {
  keywords: [mirage],
});

export const { red: flickerTrickRed } = flickerTrick.cards;
