import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { boulderDrop } from "./boulder-drop.ts";

export const boulderDropI18n = defineFamilyI18n(boulderDrop, {
  en: {
    name: "Boulder Drop",
    text: "Crush - When this deals 4 or more damage to a hero, they put a card from their hand on top of their deck.",
    typeText: "Guardian Action - Attack",
  },
});

export const {
  red: boulderDropRedI18n,
  yellow: boulderDropYellowI18n,
  blue: boulderDropBlueI18n,
} = boulderDropI18n.cards;
