import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rift-skitter.generated.ts";
import { bloodDebt, goAgain, runeGate } from "../shared/keywords.ts";

export const riftSkitter = definePitchFamily(fabPitchFamilies["rift-skitter"], {
  keywords: [runeGate, goAgain, bloodDebt],
});

export const {
  red: riftSkitterRed,
  yellow: riftSkitterYellow,
  blue: riftSkitterBlue,
} = riftSkitter.cards;
