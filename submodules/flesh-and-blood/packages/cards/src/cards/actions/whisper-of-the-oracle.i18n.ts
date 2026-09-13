import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { whisperOfTheOracle } from "./whisper-of-the-oracle.ts";

export const whisperOfTheOracleI18n = defineFamilyI18n(whisperOfTheOracle, {
  en: {
    name: "Whisper of the Oracle",
    typeText: "Generic Action",
    text: ({ optCount }) => `Opt ${optCount}\nGo again`,
  },
});

export const {
  red: whisperOfTheOracleRedI18n,
  yellow: whisperOfTheOracleYellowI18n,
  blue: whisperOfTheOracleBlueI18n,
} = whisperOfTheOracleI18n.cards;
