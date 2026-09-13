import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { heraldOfTenacity } from "./herald-of-tenacity.ts";

export const heraldOfTenacityI18n = defineFamilyI18n(heraldOfTenacity, {
  en: {
    name: "Herald of Tenacity",
    typeText: "Light Illusionist Action - Attack",
    text: "Dominate\nWhen this hits, put it into your hero's soul.\nPhantasm",
  },
});

export const {
  red: heraldOfTenacityRedI18n,
  yellow: heraldOfTenacityYellowI18n,
  blue: heraldOfTenacityBlueI18n,
} = heraldOfTenacityI18n.cards;
