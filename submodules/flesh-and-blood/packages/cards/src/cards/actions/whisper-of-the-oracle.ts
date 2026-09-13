import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/whisper-of-the-oracle.generated.ts";
import { goAgain, opt } from "../shared/keywords.ts";

export const whisperOfTheOracle = definePitchFamily(fabPitchFamilies["whisper-of-the-oracle"], {
  parameters: pitchMap({ red: { optCount: 4 }, yellow: { optCount: 3 }, blue: { optCount: 2 } }),
  keywords: pitchMap({
    red: [opt(4), goAgain],
    yellow: [opt(3), goAgain],
    blue: [opt(2), goAgain],
  }),
});

export const {
  red: whisperOfTheOracleRed,
  yellow: whisperOfTheOracleYellow,
  blue: whisperOfTheOracleBlue,
} = whisperOfTheOracle.cards;
