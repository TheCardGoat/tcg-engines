import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { heraldOfTriumph } from "./herald-of-triumph.ts";

export const heraldOfTriumphI18n = defineFamilyI18n(heraldOfTriumph, {
  en: {
    name: "Herald of Triumph",
    typeText: "Light Illusionist Action - Attack",
    text: "Attack action cards have -1{p} while defending this.\nWhen this hits, put it into your hero's soul.\nPhantasm",
  },
});

export const {
  red: heraldOfTriumphRedI18n,
  yellow: heraldOfTriumphYellowI18n,
  blue: heraldOfTriumphBlueI18n,
} = heraldOfTriumphI18n.cards;
