import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { sowTomorrow } from "./sow-tomorrow.ts";

export const sowTomorrowI18n = defineFamilyI18n(sowTomorrow, {
  en: {
    name: "Sow Tomorrow",
    text: "Put target Earth or Elemental action card with cost 0 or greater from your graveyard on the bottom of your deck. Banish Sow Tomorrow.\nIf Sow Tomorrow is played from arsenal, draw a card.\nGo again",
    typeText: "Earth Action",
  },
});
export const {
  red: sowTomorrowRedI18n,
  yellow: sowTomorrowYellowI18n,
  blue: sowTomorrowBlueI18n,
} = sowTomorrowI18n.cards;
