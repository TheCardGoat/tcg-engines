import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { transmogrify } from "./transmogrify.ts";

export const transmogrifyI18n = defineFamilyI18n(transmogrify, {
  en: {
    name: "Transmogrify",
    typeText: "Illusionist Action",
    text: "The next attack action card you play this turn is Illusionist, has 8 base {p}, and gains phantasm.\nGo again",
  },
});

export const {
  red: transmogrifyRedI18n,
  yellow: transmogrifyYellowI18n,
  blue: transmogrifyBlueI18n,
} = transmogrifyI18n.cards;
