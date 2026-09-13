import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { heraldOfRavages } from "./herald-of-ravages.ts";

export const heraldOfRavagesI18n = defineFamilyI18n(heraldOfRavages, {
  en: {
    name: "Herald of Ravages",
    typeText: "Light Illusionist Action - Attack",
    text: "When this hits, put it into your hero's soul and deal 1 arcane damage to target hero.\nPhantasm",
  },
});

export const {
  red: heraldOfRavagesRedI18n,
  yellow: heraldOfRavagesYellowI18n,
  blue: heraldOfRavagesBlueI18n,
} = heraldOfRavagesI18n.cards;
