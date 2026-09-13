import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { shadowakeGloomblade } from "./shadowake-gloomblade.ts";

export const shadowakeGloombladeI18n = defineFamilyI18n(shadowakeGloomblade, {
  en: {
    name: "Shadowake Gloomblade",
    typeText: "Shadow Runeblade Action - Attack",
    text: "You may play this from your banished zone.\nUsurp\nWhen this hits, create a Gate to i'Arathael token.\nBlood Debt",
  },
});

export const {
  red: shadowakeGloombladeRedI18n,
  yellow: shadowakeGloombladeYellowI18n,
  blue: shadowakeGloombladeBlueI18n,
} = shadowakeGloombladeI18n.cards;
