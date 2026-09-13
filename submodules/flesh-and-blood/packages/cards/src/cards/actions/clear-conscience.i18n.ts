import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { clearConscience } from "./clear-conscience.ts";

export const clearConscienceI18n = defineFamilyI18n(clearConscience, {
  en: {
    name: "Clear Conscience",
    typeText: "Illusionist Action - Attack",
    text: "When this hits a hero, each hero puts a card from their hand on the bottom of their deck and creates a Ponder token.\nFragment",
  },
});

export const {
  red: clearConscienceRedI18n,
  yellow: clearConscienceYellowI18n,
  blue: clearConscienceBlueI18n,
} = clearConscienceI18n.cards;
