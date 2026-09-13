import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { disable } from "./disable.ts";

export const disableI18n = defineFamilyI18n(disable, {
  en: {
    name: "Disable",
    text: "Crush - When this deals 4 or more damage to a hero, put a card from their arsenal on the bottom of their deck.",
    typeText: "Guardian Action - Attack",
  },
});

export const {
  red: disableRedI18n,
  yellow: disableYellowI18n,
  blue: disableBlueI18n,
} = disableI18n.cards;
