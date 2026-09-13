import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { hydraulicPress } from "./hydraulic-press.ts";

export const hydraulicPressI18n = defineFamilyI18n(hydraulicPress, {
  en: {
    name: "Hydraulic Press",
    text: "Scrap\nWhen this attacks, if it scrapped a card, this gets overpower.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: hydraulicPressRedI18n,
  yellow: hydraulicPressYellowI18n,
  blue: hydraulicPressBlueI18n,
} = hydraulicPressI18n.cards;
