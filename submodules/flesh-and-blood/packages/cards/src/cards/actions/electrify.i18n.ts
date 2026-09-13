import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { electrify } from "./electrify.ts";

export const electrifyI18n = defineFamilyI18n(electrify, {
  en: {
    name: "Electrify",
    text: "The next time an attack action card hits a hero this turn, it deals 3 damage to them.\nIf Electrify is played from arsenal, draw a card.\nGo again",
    typeText: "Lightning Action",
  },
});
export const {
  red: electrifyRedI18n,
  yellow: electrifyYellowI18n,
  blue: electrifyBlueI18n,
} = electrifyI18n.cards;
