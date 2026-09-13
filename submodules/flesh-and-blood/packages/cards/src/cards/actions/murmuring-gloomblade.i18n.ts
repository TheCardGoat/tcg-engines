import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { murmuringGloomblade } from "./murmuring-gloomblade.ts";

export const murmuringGloombladeI18n = defineFamilyI18n(murmuringGloomblade, {
  en: {
    name: "Murmuring Gloomblade",
    typeText: "Shadow Runeblade Action - Attack",
    text: "You may play this from your banished zone.\nUsurp\nWhen this attacks or hits, create a Runechant token.\nBlood Debt",
  },
});

export const {
  red: murmuringGloombladeRedI18n,
  yellow: murmuringGloombladeYellowI18n,
  blue: murmuringGloombladeBlueI18n,
} = murmuringGloombladeI18n.cards;
