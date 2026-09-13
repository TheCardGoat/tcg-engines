import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { opt } from "../shared/keywords.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/fate-foreseen.generated.ts";

export const fateForeseen = definePitchFamily(fabPitchFamilies["fate-foreseen"], {
  keywords: [opt(1)],
});

export const {
  red: fateForeseenRed,
  yellow: fateForeseenYellow,
  blue: fateForeseenBlue,
} = fateForeseen.cards;
