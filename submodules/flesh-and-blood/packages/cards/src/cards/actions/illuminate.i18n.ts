import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { illuminate } from "./illuminate.ts";

export const illuminateI18n = defineFamilyI18n(illuminate, {
  en: {
    name: "Illuminate",
    typeText: "Light Action - Attack",
    text: "If Illuminate hits, put it into your hero's soul.",
  },
});

export const {
  red: illuminateRedI18n,
  yellow: illuminateYellowI18n,
  blue: illuminateBlueI18n,
} = illuminateI18n.cards;
