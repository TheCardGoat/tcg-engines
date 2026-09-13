import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { thump } from "./thump.ts";

export const thumpI18n = defineFamilyI18n(thump, {
  en: {
    name: "Thump",
    text: 'While Thump\'s {p} is greater than its base {p}, it gains dominate and "If this hits a hero, they discard a card."',
    typeText: "Guardian Action - Attack",
  },
});

export const { red: thumpRedI18n, yellow: thumpYellowI18n, blue: thumpBlueI18n } = thumpI18n.cards;
