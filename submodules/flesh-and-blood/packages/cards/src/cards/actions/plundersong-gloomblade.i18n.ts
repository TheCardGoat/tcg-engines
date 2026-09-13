import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { plundersongGloomblade } from "./plundersong-gloomblade.ts";
const textByColor = {
  red: "You may play this from your banished zone.\nUsurp\nWhen this hits a hero, they banish a card in their arsenal.\nBlood Debt",
} as const;
export const plundersongGloombladeI18n = defineFamilyI18n(plundersongGloomblade, {
  en: {
    name: "Plundersong Gloomblade",
    typeText: "Shadow Runeblade Action - Attack",
    text: (_parameter, color) => textByColor[color],
  },
});
export const { red: plundersongGloombladeRedI18n } = plundersongGloombladeI18n.cards;
