import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { cullingsongGloomblade } from "./cullingsong-gloomblade.ts";
const textByColor = {
  red: "You may play this from your banished zone.\nUsurp\nWhen this hits a hero, they banish a card from their hand.\nBlood Debt",
} as const;
export const cullingsongGloombladeI18n = defineFamilyI18n(cullingsongGloomblade, {
  en: {
    name: "Cullingsong Gloomblade",
    typeText: "Shadow Runeblade Action - Attack",
    text: (_parameter, color) => textByColor[color],
  },
});
export const { red: cullingsongGloombladeRedI18n } = cullingsongGloombladeI18n.cards;
