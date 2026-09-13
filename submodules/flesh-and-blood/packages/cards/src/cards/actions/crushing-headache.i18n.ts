import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { crushingHeadache } from "./crushing-headache.ts";

export const crushingHeadacheI18n = defineFamilyI18n(crushingHeadache, {
  en: {
    name: "Crushing Headache",
    typeText: "Guardian Action - Attack",
    text: "Crush - When this deals 4 or more damage to a hero, they reveal their arsenal and hand. Destroy all non-attack action cards in their arsenal, and they discard all non-attack action cards in their hand revealed this way.",
  },
});

export const { red: crushingHeadacheRedI18n } = crushingHeadacheI18n.cards;
