import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { dimenxxionalFerryman } from "./dimenxxional-ferryman.ts";
const textByColor = {
  blue: "Put this and an action card with blood debt from your banished zone on the bottom of your deck.\nGo again",
} as const;
export const dimenxxionalFerrymanI18n = defineFamilyI18n(dimenxxionalFerryman, {
  en: {
    name: "Dimenxxional Ferryman",
    typeText: "Shadow Action",
    text: (_parameter, color) => textByColor[color],
  },
});
export const { blue: dimenxxionalFerrymanBlueI18n } = dimenxxionalFerrymanI18n.cards;
